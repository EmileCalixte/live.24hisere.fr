import {type Race} from "../types/Race";
import {verbose} from "./utils";
import {
    type ProcessedRanking,
    type ProcessedRankingRunner,
    type Ranking,
    type RankingRunner,
    type RankingRunnerRanks,
} from "../types/Ranking";
import {Gender, type GenderWithMixed} from "../types/Runner";

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

export class RankingProcesser {
    private readonly race: Race;

    private readonly ranking: Ranking;

    private processedRanking: ProcessedRanking | undefined;

    // Temporary objects to keep track of the current ranking for each category and each gender during ranking processing
    private currentRanksByCategory: CurrentRanksByCategory = {
        scratch: { // Scratch includes all solo runners regardless of their category
            mixed: {rank: 0, lastRunner: null},
            [Gender.M]: {rank: 0, lastRunner: null},
            [Gender.F]: {rank: 0, lastRunner: null},
        },
        // Other categories will be appended here
    };

    constructor(race: Race, ranking: Ranking) {
        this.race = race;
        this.ranking = ranking;
    }

    public getProcessedRanking = (): ProcessedRanking => {
        if (this.processedRanking === undefined) {
            return this.processRanking();
        }

        return this.processedRanking;
    };

    private readonly processRanking = (): ProcessedRanking => {
        verbose("Processing ranking");

        const processedRanking: ProcessedRanking = [];

        for (const runner of this.ranking) {
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

            if (!(runner.category in this.currentRanksByCategory)) {
                this.addCategoryToCurrentRanks(runner.category);
            }

            rankings.actual.scratchMixed = this.currentRanksByCategory.scratch.mixed.rank + 1;
            rankings.actual.scratchGender = this.currentRanksByCategory.scratch[runner.gender].rank + 1;
            rankings.actual.categoryMixed = this.currentRanksByCategory[runner.category].mixed.rank + 1;
            rankings.actual.categoryGender = this.currentRanksByCategory[runner.category][runner.gender].rank + 1;

            let scratchMixedPreviousRunner = null;
            let scratchGenderPreviousRunner = null;
            let categoryMixedPreviousRunner = null;
            let categoryGenderPreviousRunner = null;

            scratchMixedPreviousRunner = this.getCurrentLastRunner("scratch", "mixed");
            scratchGenderPreviousRunner = this.getCurrentLastRunner("scratch", runner.gender);
            categoryMixedPreviousRunner = this.getCurrentLastRunner(runner.category, "mixed");
            categoryGenderPreviousRunner = this.getCurrentLastRunner(runner.category, runner.gender);

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
                distance = this.race.initialDistance + this.race.lapDistance * (runner.passageCount - 1);
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
    };

    private readonly getCurrentLastRunner = (category: string, gender: GenderWithMixed): ProcessedRankingRunner | null => {
        if (!(category in this.currentRanksByCategory)) {
            return null;
        }

        return this.currentRanksByCategory[category][gender].lastRunner;
    };

    private readonly addCategoryToCurrentRanks = (category: string) => {
        if (category in this.currentRanksByCategory) {
            throw new Error("Category already existing in current ranks");
        }

        this.currentRanksByCategory[category] = {
            mixed: {rank: 0, lastRunner: null},
            [Gender.M]: {rank: 0, lastRunner: null},
            [Gender.F]: {rank: 0, lastRunner: null},
        };
    };

    private readonly updateCurrentRanks = (runner: ProcessedRankingRunner) => {
        if (!(runner.category in this.currentRanksByCategory)) {
            this.addCategoryToCurrentRanks(runner.category);
        }

        ++this.currentRanksByCategory.scratch.mixed.rank;
        this.currentRanksByCategory.scratch.mixed.lastRunner = runner;

        ++this.currentRanksByCategory.scratch[runner.gender].rank;
        this.currentRanksByCategory.scratch[runner.gender].lastRunner = runner;

        ++this.currentRanksByCategory[runner.category].mixed.rank;
        this.currentRanksByCategory[runner.category].mixed.lastRunner = runner;

        ++this.currentRanksByCategory[runner.category][runner.gender].rank;
        this.currentRanksByCategory[runner.category][runner.gender].lastRunner = runner;
    };

    private readonly areRunnersEqual = (runner1: RankingRunner | null, runner2: RankingRunner | null) => {
        if (runner1 === null || runner2 === null) {
            return false;
        }

        if (runner1.passageCount !== runner2.passageCount) {
            return false;
        }

        return (new Date(runner1.lastPassageTime)).getTime() === (new Date(runner2.lastPassageTime)).getTime();
    };
}
