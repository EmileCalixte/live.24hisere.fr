import { GENDER_MIXED } from "../constants/Gender";
import { type GenderWithMixed } from "../types/Gender";
import { type Race } from "../types/Race";
import { MinimalRankingRunnerInput, type Ranking, type RankingRunnerRanks } from "../types/Ranking";
import { type RunnerWithPassages, type RunnerWithProcessedData } from "../types/Runner";
import { getCategoryCodeFromBirthYear } from "../util/ffaUtils";
import { getRunnerProcessedDataFromPassages } from "../util/passageUtils";
import { areRunnersEqual, spaceshipRunners } from "../util/runnerUtils";

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

export class RankingCalculator<T extends MinimalRankingRunnerInput> {
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
        race: Race,
        private readonly runners: T[],
        rankingDate?: Date,
    ) {
        this.runners = this.runners.filter(runner => runner.raceId === race.id);

        if (rankingDate) {
            this.runners = this.runners.map(runner => {
                const passages = runner.passages.filter(passage => new Date(passage.time).getTime() < rankingDate.getTime());

                return {
                    ...runner,
                    ...getRunnerProcessedDataFromPassages(race, passages),
                    passages,
                };
            });
        }

        this.runners = this.runners.sort(spaceshipRunners);
    }

    public getRanking(): Ranking<T> {
        return this.computeRanks();
    }

    /**
     * Compute detailed ranking for each runner's category and gender
     */
    private computeRanks(): Ranking<T> {
        const ranking: Ranking<T> = [];

        for (const runner of this.runners) {
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

            const scratchMixedPreviousRunner = this.getCurrentLastRunner("scratch", GENDER_MIXED, ranking);
            const scratchGenderPreviousRunner = this.getCurrentLastRunner("scratch", runner.gender, ranking);
            const categoryMixedPreviousRunner = this.getCurrentLastRunner(runnerCategoryCode, GENDER_MIXED, ranking);
            const categoryGenderPreviousRunner = this.getCurrentLastRunner(runnerCategoryCode, runner.gender, ranking);

            const scratchMixedPreviousRunnerEquality = scratchMixedPreviousRunner && areRunnersEqual(runner, scratchMixedPreviousRunner);
            const scratchGenderPreviousRunnerEquality = scratchGenderPreviousRunner && areRunnersEqual(runner, scratchGenderPreviousRunner);
            const categoryMixedPreviousRunnerEquality = categoryMixedPreviousRunner && areRunnersEqual(runner, categoryMixedPreviousRunner);
            const categoryGenderPreviousRunnerEquality = categoryGenderPreviousRunner && areRunnersEqual(runner, categoryGenderPreviousRunner);

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

            ranking.push({
                ...runner,
                ranks: rankings,
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

    private getCurrentLastRunner(category: string, gender: GenderWithMixed, ranking: Ranking<T>): Ranking<T>[number] | null {
        if (!(category in this.currentRanksByCategory)) {
            return null;
        }

        const lastRunnerId = this.currentRanksByCategory[category][gender].lastRunnerId;

        if (!lastRunnerId) {
            return null;
        }

        return ranking.find(runner => runner.id === lastRunnerId) ?? null;
    }
}
