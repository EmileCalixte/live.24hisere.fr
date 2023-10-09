import { GENDER_MIXED } from "../constants/Gender";
import { type GenderWithMixed } from "../types/Gender";
import { type Race } from "../types/Race";
import { type ProcessedRanking, type ProcessedRankingRunner, type OldRanking, type OldRankingRunner, type RankingRunnerRanks } from "../types/Ranking";
import { getCategoryCodeFromBirthYear } from "./ffaUtils";
import { verbose } from "./utils";

type CategoryGenderRanks = {
    [key in GenderWithMixed]: {
        rank: number;
        lastRunner: ProcessedRankingRunner | null;
    };
};

interface CurrentRanksByCategory {
    scratch: CategoryGenderRanks;
    [key: string]: CategoryGenderRanks;
}

/**
 * @deprecated
 */
export class RankingProcesser {
    private readonly race: Race;

    private readonly ranking: OldRanking;

    private processedRanking: ProcessedRanking | undefined;

    // Temporary objects to keep track of the current ranking for each category and each gender during ranking processing
    private currentRanksByCategory: CurrentRanksByCategory = {
        scratch: { // Scratch includes all solo runners regardless of their category
            mixed: { rank: 0, lastRunner: null },
            M: { rank: 0, lastRunner: null },
            F: { rank: 0, lastRunner: null },
        },
        // Other categories will be appended here
    };

    constructor(race: Race, ranking: OldRanking) {
        this.race = race;
        this.ranking = ranking;
    }

    public getProcessedRanking(): ProcessedRanking {
        if (this.processedRanking === undefined) {
            return this.processRanking();
        }

        return this.processedRanking;
    }

    private processRanking(): ProcessedRanking {
        verbose("Processing ranking");

        const raceInitialDistance = Number(this.race.initialDistance);
        const raceLapDistance = Number(this.race.lapDistance);

        const processedRanking: ProcessedRanking = [];

        for (const runner of this.ranking) {
            const runnerCategory = getCategoryCodeFromBirthYear(runner.birthYear);

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

            if (!(runnerCategory in this.currentRanksByCategory)) {
                this.addCategoryToCurrentRanks(runnerCategory);
            }

            rankings.actual.scratchMixed = this.currentRanksByCategory.scratch.mixed.rank + 1;
            rankings.actual.scratchGender = this.currentRanksByCategory.scratch[runner.gender].rank + 1;
            rankings.actual.categoryMixed = this.currentRanksByCategory[runnerCategory].mixed.rank + 1;
            rankings.actual.categoryGender = this.currentRanksByCategory[runnerCategory][runner.gender].rank + 1;

            let scratchMixedPreviousRunner = null;
            let scratchGenderPreviousRunner = null;
            let categoryMixedPreviousRunner = null;
            let categoryGenderPreviousRunner = null;

            scratchMixedPreviousRunner = this.getCurrentLastRunner("scratch", GENDER_MIXED);
            scratchGenderPreviousRunner = this.getCurrentLastRunner("scratch", runner.gender);
            categoryMixedPreviousRunner = this.getCurrentLastRunner(runnerCategory, GENDER_MIXED);
            categoryGenderPreviousRunner = this.getCurrentLastRunner(runnerCategory, runner.gender);

            const scratchMixedPreviousRunnerEquality = this.areRunnersEqual(runner, scratchMixedPreviousRunner);
            const scratchGenderPreviousRunnerEquality = this.areRunnersEqual(runner, scratchGenderPreviousRunner);
            const categoryMixedPreviousRunnerEquality = this.areRunnersEqual(runner, categoryMixedPreviousRunner);
            const categoryGenderPreviousRunnerEquality = this.areRunnersEqual(runner, categoryGenderPreviousRunner);

            if (scratchMixedPreviousRunner && scratchMixedPreviousRunnerEquality) {
                rankings.displayed.scratchMixed = scratchMixedPreviousRunner.rankings.displayed.scratchMixed;
            } else {
                rankings.displayed.scratchMixed = rankings.actual.scratchMixed;
            }

            if (scratchGenderPreviousRunner && scratchGenderPreviousRunnerEquality) {
                rankings.displayed.scratchGender = scratchGenderPreviousRunner.rankings.displayed.scratchGender;
            } else {
                rankings.displayed.scratchGender = rankings.actual.scratchGender;
            }

            if (categoryMixedPreviousRunner && categoryMixedPreviousRunnerEquality) {
                rankings.displayed.categoryMixed = categoryMixedPreviousRunner.rankings.displayed.categoryMixed;
            } else {
                rankings.displayed.categoryMixed = rankings.actual.categoryMixed;
            }

            if (categoryGenderPreviousRunner && categoryGenderPreviousRunnerEquality) {
                rankings.displayed.categoryGender = categoryGenderPreviousRunner.rankings.displayed.categoryGender;
            } else {
                rankings.displayed.categoryGender = rankings.actual.categoryGender;
            }

            let distance = 0;
            let lastPassageRaceTime = null;
            let averageSpeed = null;

            if (runner.passageCount > 0) {
                if (raceInitialDistance > 0) {
                    distance = raceInitialDistance + raceLapDistance * (runner.passageCount - 1);
                } else {
                    distance = raceLapDistance * runner.passageCount;
                }
            }

            if (runner.lastPassageTime !== null) {
                const lastPassageTime = new Date(runner.lastPassageTime);

                lastPassageRaceTime = lastPassageTime.getTime() - new Date(this.race.startTime).getTime();

                averageSpeed = (distance / (lastPassageRaceTime / 1000)) * 3.6;
            }

            const processedRankingRunner: ProcessedRankingRunner = {
                ...runner,
                distance,
                lastPassageRaceTime,
                averageSpeed,
                rankings,
            };

            this.updateCurrentRanks(processedRankingRunner);

            processedRanking.push(processedRankingRunner);
        }

        this.processedRanking = processedRanking;

        verbose("Ranking processed");

        return this.processedRanking;
    }

    private getCurrentLastRunner(category: string, gender: GenderWithMixed): ProcessedRankingRunner | null {
        if (!(category in this.currentRanksByCategory)) {
            return null;
        }

        return this.currentRanksByCategory[category][gender].lastRunner;
    }

    private addCategoryToCurrentRanks(category: string): void {
        if (category in this.currentRanksByCategory) {
            throw new Error("Category already existing in current ranks");
        }

        this.currentRanksByCategory[category] = {
            mixed: { rank: 0, lastRunner: null },
            M: { rank: 0, lastRunner: null },
            F: { rank: 0, lastRunner: null },
        };
    }

    private updateCurrentRanks(runner: ProcessedRankingRunner): void {
        const runnerCategory = getCategoryCodeFromBirthYear(runner.birthYear);

        if (!(runnerCategory in this.currentRanksByCategory)) {
            this.addCategoryToCurrentRanks(runnerCategory);
        }

        ++this.currentRanksByCategory.scratch.mixed.rank;
        this.currentRanksByCategory.scratch.mixed.lastRunner = runner;

        ++this.currentRanksByCategory.scratch[runner.gender].rank;
        this.currentRanksByCategory.scratch[runner.gender].lastRunner = runner;

        ++this.currentRanksByCategory[runnerCategory].mixed.rank;
        this.currentRanksByCategory[runnerCategory].mixed.lastRunner = runner;

        ++this.currentRanksByCategory[runnerCategory][runner.gender].rank;
        this.currentRanksByCategory[runnerCategory][runner.gender].lastRunner = runner;
    }

    private areRunnersEqual(runner1: OldRankingRunner | null, runner2: OldRankingRunner | null): boolean {
        if (runner1 === null || runner2 === null) {
            return false;
        }

        if (runner1.passageCount !== runner2.passageCount) {
            return false;
        }

        return (new Date(runner1.lastPassageTime)).getTime() === (new Date(runner2.lastPassageTime)).getTime();
    }
}
