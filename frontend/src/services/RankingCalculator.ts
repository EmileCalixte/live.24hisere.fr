import { GENDER_MIXED } from "../constants/gender";
import { type GenderWithMixed } from "../types/Gender";
import { type Race } from "../types/Race";
import {
    type MinimalRankingRunnerInput,
    type Ranking, RankingRunner,
    type RankingRunnerGaps,
    type RankingRunnerRanks,
} from "../types/Ranking";
import { getCategoryCodeFromBirthYear } from "../utils/ffaUtils";
import { getRunnerProcessedDataFromPassages } from "../utils/passageUtils";
import { areRunnersEqual, getGapBetweenRunners, spaceshipRunners } from "../utils/runnerUtils";

type CategoryGenderRanks = {
    [key in GenderWithMixed]: {
        rank: number;
        lastRunnerId: number | null;
    };
};

type CategoryGenderFirstRunners<T extends MinimalRankingRunnerInput> = {
    [key in GenderWithMixed]: RankingRunner<T> | null;
};

interface CurrentRanksByCategory {
    scratch: CategoryGenderRanks;
    [key: string]: CategoryGenderRanks;
}

interface FirstRunnersByCategory<T extends MinimalRankingRunnerInput> {
    scratch: CategoryGenderFirstRunners<T>;
    [key: string]: CategoryGenderFirstRunners<T>;
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

    // Temporary objects to keep in memory the first runners of each ranking
    private firstRunnersByCategory: FirstRunnersByCategory<T> = {
        scratch: {
            mixed: null,
            M: null,
            F: null,
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

            const scratchMixedFirstRunner = this.getFirstRunner("scratch", GENDER_MIXED);
            const scratchGenderFirstRunner = this.getFirstRunner("scratch", runner.gender);
            const categoryMixedFirstRunner = this.getFirstRunner(runnerCategoryCode, GENDER_MIXED);
            const categoryGenderFirstRunner = this.getFirstRunner(runnerCategoryCode, runner.gender);

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

            const gaps: RankingRunnerGaps<T> = {
                firstRunner: {
                    scratchMixed: {
                        runner: scratchMixedFirstRunner,
                        gap: getGapBetweenRunners(scratchMixedFirstRunner ?? runner, runner),
                    },
                    scratchGender: {
                        runner: scratchGenderFirstRunner,
                        gap: getGapBetweenRunners(scratchGenderFirstRunner ?? runner, runner),
                    },
                    categoryMixed: {
                        runner: categoryMixedFirstRunner,
                        gap: getGapBetweenRunners(categoryMixedFirstRunner ?? runner, runner),
                    },
                    categoryGender: {
                        runner: categoryGenderFirstRunner,
                        gap: getGapBetweenRunners(categoryGenderFirstRunner ?? runner, runner),
                    },
                },
                previousRunner: {
                    scratchMixed: {
                        runner: scratchMixedPreviousRunner,
                        gap: getGapBetweenRunners(scratchMixedPreviousRunner ?? runner, runner),
                    },
                    scratchGender: {
                        runner: scratchGenderPreviousRunner,
                        gap: getGapBetweenRunners(scratchGenderPreviousRunner ?? runner, runner),
                    },
                    categoryMixed: {
                        runner: categoryMixedPreviousRunner,
                        gap: getGapBetweenRunners(categoryMixedPreviousRunner ?? runner, runner),
                    },
                    categoryGender: {
                        runner: categoryGenderPreviousRunner,
                        gap: getGapBetweenRunners(categoryGenderPreviousRunner ?? runner, runner),
                    },
                },
            };

            // Update current ranks object with current runner data for next iteration
            this.currentRanksByCategory.scratch.mixed.lastRunnerId = runner.id;
            this.currentRanksByCategory.scratch[runner.gender].lastRunnerId = runner.id;
            this.currentRanksByCategory[runnerCategoryCode].mixed.lastRunnerId = runner.id;
            this.currentRanksByCategory[runnerCategoryCode][runner.gender].lastRunnerId = runner.id;

            const rankingRunnner = {
                ...runner,
                ranks: rankings,
                gaps,
            };

            ranking.push(rankingRunnner);

            this.updateFirstRunners(rankingRunnner);
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

    private updateFirstRunners(runner: Ranking<T>[number]): void {
        const runnerCategoryCode = getCategoryCodeFromBirthYear(runner.birthYear);

        if (!(runnerCategoryCode in this.firstRunnersByCategory)) {
            this.addCategoryCodeToFirstRunners(runnerCategoryCode);
        }

        if (!this.firstRunnersByCategory.scratch.mixed) {
            this.firstRunnersByCategory.scratch.mixed = runner;
        }

        if (!this.firstRunnersByCategory.scratch[runner.gender]) {
            this.firstRunnersByCategory.scratch[runner.gender] = runner;
        }

        if (!this.firstRunnersByCategory[runnerCategoryCode].mixed) {
            this.firstRunnersByCategory[runnerCategoryCode].mixed = runner;
        }

        if (!this.firstRunnersByCategory[runnerCategoryCode][runner.gender]) {
            this.firstRunnersByCategory[runnerCategoryCode][runner.gender] = runner;
        }
    }

    private addCategoryCodeToFirstRunners(categoryCode: string): void {
        if (categoryCode in this.firstRunnersByCategory) {
            throw new Error("Category already existing in first runners by category");
        }

        this.firstRunnersByCategory[categoryCode] = {
            mixed: null,
            M: null,
            F: null,
        };
    }

    private getFirstRunner(category: string, gender: GenderWithMixed): Ranking<T>[number] | null {
        if (!(category in this.firstRunnersByCategory)) {
            return null;
        }

        return this.firstRunnersByCategory[category][gender]
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
