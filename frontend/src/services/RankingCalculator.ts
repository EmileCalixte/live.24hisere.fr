import { GENDER_MIXED } from "../constants/Gender";
import { HOUR_IN_MS } from "../constants/misc";
import { getPaceFromSpeed, getSpeed } from "../helpers/mathHelper";
import { getRaceTime } from "../helpers/raceHelper";
import { getRunnerLapsInInterval, getRunnerTotalDistance, getAverageSpeedInInterval } from "../helpers/runnerHelper";
import { type GenderWithMixed } from "../types/Gender";
import { type Passage, type PassageWithRunnerId, type ProcessedPassage } from "../types/Passage";
import { type Race } from "../types/Race";
import { type Ranking, type RankingRunnerRanks } from "../types/Ranking";
import { type Runner, type RunnerProcessedHour } from "../types/Runner";
import { spaceship } from "../util/compareUtils";
import { getCategoryCodeFromBirthYear } from "../util/ffaUtils";
import { isDateValid } from "../util/utils";

/**
 * The first step of the ranking calculation. The runners have to be sorted
 */
type RankingCalculationStep1 = Array<Omit<RankingCalculationStep2[number], "distance" | "averageSpeed" | "averagePace">>;

type RankingCalculationStep2 = Array<Omit<RankingCalculationStep3[number], "ranks">>;

type RankingCalculationStep3 = Array<Omit<RankingCalculationStep4[number], "passages"> & { passages: Passage[] }>;

type RankingCalculationStep4 = Array<Omit<Ranking[number], "hours">>;

type CategoryGenderRanks = {
    [key in GenderWithMixed]: {
        rank: number;
        lastRunnerId: number | null;
    };
};

interface CurrentRanksByCategory {
    scratch: CategoryGenderRanks;
    [key: string]: CategoryGenderRanks;
}

export class RankingCalculator {
    // Temporary objects to keep track of the current ranking for each category and each gender during ranking processing
    private currentRanksByCategory: CurrentRanksByCategory = {
        scratch: { // Scratch includes all solo runners regardless of their category
            mixed: { rank: 0, lastRunnerId: null },
            M: { rank: 0, lastRunnerId: null },
            F: { rank: 0, lastRunnerId: null },
        },
        // Other categories will be appended here
    };

    constructor(
        private readonly race: Race,
        private readonly runners: Runner[],
        private readonly passages: PassageWithRunnerId[],
        private readonly rankingDate?: Date,
    ) {
        this.runners = this.runners.filter(runner => runner.raceId === this.race.id);
    }

    public getRanking(): Ranking {
        const step1 = this.computeStep1(); // The runners with passage count and last passage time, ordered from fastest to slowest and with passages ordered by time
        const step2 = this.computeStep2(step1); // Add total distance, average speed and pace to each runner
        const step3 = this.computeStep3(step2); // Add detailed rankings to each runner
        const step4 = this.computeStep4(step3); // Add detailed data about each passage of each runner
        const step5 = this.computeStep5(step4); // Add detailed data about each race hour of each runner

        return step5;
    }

    /**
     * Find each runner's passage, count runner passages and order runners and passages
     */
    private computeStep1(): RankingCalculationStep1 {
        const rankingStep1: RankingCalculationStep1 = this.runners.map(runner => ({
            ...runner,
            passageCount: 0,
            lastPassageTime: null,
            passages: [],
        }));

        for (const passage of this.passages) {
            const passageTime = new Date(passage.time);

            if (!isDateValid(passageTime)) {
                continue;
            }

            if (this.rankingDate && (passageTime > this.rankingDate)) {
                continue;
            }

            const runner = rankingStep1.find(runner => runner.id === passage.runnerId);

            if (!runner) {
                continue; // This passage's runner is not part of the ranking
            }

            runner.passages.push(passage);
            runner.passageCount++;

            if (!runner.lastPassageTime || runner.lastPassageTime.time.getTime() < passageTime.getTime()) {
                runner.lastPassageTime = {
                    time: passageTime,
                    raceTime: getRaceTime(this.race, passageTime),
                };
            }
        }

        return rankingStep1
            .sort((runnerA, runnerB) => {
                if (runnerA.passageCount === runnerB.passageCount) {
                    // When two riders have completed the same number of laps,
                    // the one who has completed them the fastest is considered to be faster than the other.
                    return spaceship(runnerA.lastPassageTime?.raceTime, runnerB.lastPassageTime?.raceTime);
                }

                return spaceship(runnerB.passageCount, runnerA.passageCount);
            })
            .map(runner => ({
                ...runner,
                passages: runner.passages.sort((passageA, passageB) => spaceship(
                    new Date(passageA.time).getTime(),
                    new Date(passageB.time).getTime(),
                )),
            }));
    }

    /**
     * Compute distance, average speed and average pace for each runner of the ranking
     */
    private computeStep2(rankingStep1: RankingCalculationStep1): RankingCalculationStep2 {
        return rankingStep1.map(runner => {
            const distance = getRunnerTotalDistance(runner, this.race);

            const averageSpeed = runner.lastPassageTime ? getSpeed(distance, runner.lastPassageTime.raceTime) : null;
            const averagePace = averageSpeed ? getPaceFromSpeed(averageSpeed) : null;

            return {
                ...runner,
                distance,
                averageSpeed,
                averagePace,
            };
        });
    }

    /**
     * Compute detailed ranking for each runner's category and gender
     */
    private computeStep3(rankingStep2: RankingCalculationStep2): RankingCalculationStep3 {
        const rankingStep3: RankingCalculationStep3 = [];

        for (const runner of rankingStep2) {
            const runnerCategoryCode = getCategoryCodeFromBirthYear(runner.birthYear);

            const rankings: RankingRunnerRanks = {
                actual: {
                    scratchMixed: 0,
                    scratchGender: 0,
                    categoryMixed: 0,
                    categoryGender: 0,
                },
                displayed: {
                    scratchMixed: 0,
                    scratchGender: 0,
                    categoryMixed: 0,
                    categoryGender: 0,
                },
            };

            this.ensureCategoryCodeIsInCurrentRanks(runnerCategoryCode);

            rankings.actual.scratchMixed = ++this.currentRanksByCategory.scratch.mixed.rank;
            rankings.actual.scratchGender = ++this.currentRanksByCategory.scratch[runner.gender].rank;
            rankings.actual.categoryMixed = ++this.currentRanksByCategory[runnerCategoryCode].mixed.rank;
            rankings.actual.categoryGender = ++this.currentRanksByCategory[runnerCategoryCode][runner.gender].rank;

            const scratchMixedPreviousRunner = this.getCurrentLastRunner("scratch", GENDER_MIXED, rankingStep3);
            const scratchGenderPreviousRunner = this.getCurrentLastRunner("scratch", runner.gender, rankingStep3);
            const categoryMixedPreviousRunner = this.getCurrentLastRunner(runnerCategoryCode, GENDER_MIXED, rankingStep3);
            const categoryGenderPreviousRunner = this.getCurrentLastRunner(runnerCategoryCode, runner.gender, rankingStep3);

            const scratchMixedPreviousRunnerEquality = this.areRunnersEqual(runner, scratchMixedPreviousRunner);
            const scratchGenderPreviousRunnerEquality = this.areRunnersEqual(runner, scratchGenderPreviousRunner);
            const categoryMixedPreviousRunnerEquality = this.areRunnersEqual(runner, categoryMixedPreviousRunner);
            const categoryGenderPreviousRunnerEquality = this.areRunnersEqual(runner, categoryGenderPreviousRunner);

            if (scratchMixedPreviousRunner && scratchMixedPreviousRunnerEquality) {
                rankings.displayed.scratchMixed = scratchMixedPreviousRunner.ranks.displayed.scratchMixed;
            } else {
                rankings.displayed.scratchMixed = rankings.actual.scratchMixed;
            }

            if (scratchGenderPreviousRunner && scratchGenderPreviousRunnerEquality) {
                rankings.displayed.scratchGender = scratchGenderPreviousRunner.ranks.displayed.scratchGender;
            } else {
                rankings.displayed.scratchGender = rankings.actual.scratchGender;
            }

            if (categoryMixedPreviousRunner && categoryMixedPreviousRunnerEquality) {
                rankings.displayed.categoryMixed = categoryMixedPreviousRunner.ranks.displayed.categoryMixed;
            } else {
                rankings.displayed.categoryMixed = rankings.actual.categoryMixed;
            }

            if (categoryGenderPreviousRunner && categoryGenderPreviousRunnerEquality) {
                rankings.displayed.categoryGender = categoryGenderPreviousRunner.ranks.displayed.categoryGender;
            } else {
                rankings.displayed.categoryGender = rankings.actual.categoryGender;
            }

            this.currentRanksByCategory.scratch.mixed.lastRunnerId = runner.id;
            this.currentRanksByCategory.scratch[runner.gender].lastRunnerId = runner.id;
            this.currentRanksByCategory[runnerCategoryCode].mixed.lastRunnerId = runner.id;
            this.currentRanksByCategory[runnerCategoryCode][runner.gender].lastRunnerId = runner.id;

            rankingStep3.push({
                ...runner,
                ranks: rankings,
            });
        }

        return rankingStep3;
    }

    /**
     * Add detailed data to passages of each ranking runner
     */
    private computeStep4(rankingStep3: RankingCalculationStep3): RankingCalculationStep4 {
        const raceInitialDistance = Number(this.race.initialDistance);
        const raceLapDistance = Number(this.race.lapDistance);

        const rankingStep4: RankingCalculationStep4 = [];

        for (const runner of rankingStep3) {
            const processedPassages: ProcessedPassage[] = [];

            let totalDistance = 0;

            for (let i = 0; i < runner.passages.length; ++i) {
                const isFirstPassage = i === 0;

                const passage = runner.passages[i];
                const previousPassage = isFirstPassage ? null : runner.passages[i - 1];

                let lapNumber: number | null;

                if (raceInitialDistance <= 0) {
                    lapNumber = i + 1;
                } else {
                    lapNumber = isFirstPassage ? null : i; // The first passage is an incomplete lap, so it's not counted
                }

                const lapDistance = lapNumber === null ? raceInitialDistance : raceLapDistance;
                const lapStartTime = previousPassage ? new Date(previousPassage.time) : new Date(this.race.startTime);
                const lapEndTime = new Date(passage.time);

                if (!isDateValid(lapStartTime)) {
                    throw new Error("Invalid passage start time");
                }

                if (!isDateValid(lapEndTime)) {
                    throw new Error("Invalid passage end time");
                }

                totalDistance += lapDistance;

                const lapStartRaceTime = getRaceTime(this.race, lapStartTime);
                const lapEndRaceTime = getRaceTime(this.race, lapEndTime);
                const lapDuration = lapEndRaceTime - lapStartRaceTime;

                const lapSpeed = getSpeed(lapDistance, lapDuration);
                const lapPace = getPaceFromSpeed(lapSpeed);

                const averageSpeedSinceRaceStart = getSpeed(totalDistance, lapEndRaceTime);
                const averagePaceSinceRaceStart = getPaceFromSpeed(averageSpeedSinceRaceStart);

                processedPassages.push({
                    ...passage,
                    processed: {
                        lapNumber,
                        lapDistance,
                        lapDuration,
                        lapStartTime,
                        lapStartRaceTime,
                        lapEndTime,
                        lapEndRaceTime,
                        lapPace,
                        lapSpeed,
                        totalDistance,
                        averagePaceSinceRaceStart,
                        averageSpeedSinceRaceStart,
                    },
                });
            }

            rankingStep4.push({
                ...runner,
                passages: processedPassages,
            });
        }

        return rankingStep4;
    }

    private computeStep5(rankingStep4: RankingCalculationStep4): Ranking {
        const ranking: Ranking = [];

        for (const runner of rankingStep4) {
            const hours: RunnerProcessedHour[] = [];

            const raceStartTime = new Date(this.race.startTime);
            const raceDurationMs = this.race.duration * 1000 - 1; // - 1 to not create an hour of 1 ms

            for (let hourStartRaceTime = 0; hourStartRaceTime <= raceDurationMs; hourStartRaceTime += HOUR_IN_MS) {
                const hourEndRaceTime = Math.min(hourStartRaceTime + HOUR_IN_MS - 1, raceDurationMs);
                const hourStartTime = new Date(raceStartTime.getTime() + hourStartRaceTime);
                const hourEndTime = new Date(raceStartTime.getTime() + hourEndRaceTime);

                const passages = getRunnerLapsInInterval(runner.passages, hourStartTime, hourEndTime);

                let averageSpeed = null;
                let averagePace = null;

                if (passages.length > 0) {
                    averageSpeed = getAverageSpeedInInterval(passages, hourStartTime, hourEndTime);
                    averagePace = getPaceFromSpeed(averageSpeed);
                }

                const hour: RunnerProcessedHour = {
                    startTime: hourStartTime,
                    startRaceTime: hourStartRaceTime,
                    endTime: hourEndTime,
                    endRaceTime: hourEndRaceTime,
                    passages,
                    averageSpeed,
                    averagePace,
                };

                hours.push(hour);
            }

            ranking.push({
                ...runner,
                hours,
            });
        }

        return ranking;
    }

    private ensureCategoryCodeIsInCurrentRanks(categoryCode: string): void {
        if (!(categoryCode in this.currentRanksByCategory)) {
            this.addCategoryCodeToCurrentRanks(categoryCode);
        }
    }

    private addCategoryCodeToCurrentRanks(categoryCode: string): void {
        if (categoryCode in this.currentRanksByCategory) {
            throw new Error("Category already existing in current ranks");
        }

        this.currentRanksByCategory[categoryCode] = {
            mixed: { rank: 0, lastRunnerId: null },
            M: { rank: 0, lastRunnerId: null },
            F: { rank: 0, lastRunnerId: null },
        };
    }

    private getCurrentLastRunner(category: string, gender: GenderWithMixed, rankingStep3: RankingCalculationStep3): RankingCalculationStep3[number] | null {
        if (!(category in this.currentRanksByCategory)) {
            return null;
        }

        const lastRunnerId = this.currentRanksByCategory[category][gender].lastRunnerId;

        if (!lastRunnerId) {
            return null;
        }

        return rankingStep3.find(runner => runner.id === lastRunnerId) ?? null;
    }

    private areRunnersEqual(runner1: RankingCalculationStep1[number] | null, runner2: RankingCalculationStep1[number] | null): boolean {
        if (runner1 === null || runner2 === null) {
            return false;
        }

        if (runner1.passageCount !== runner2.passageCount) {
            return false;
        }

        return runner1.lastPassageTime?.raceTime === runner2.lastPassageTime?.raceTime;
    }
}
