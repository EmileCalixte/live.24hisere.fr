import Util from "./Util";
import {app} from "../components/App";
import {
    ProcessedRanking,
    ProcessedRankingRunner,
    Ranking,
    RankingRunner,
    RankingRunnerRankings
} from "../types/Ranking";
import {Gender, GenderWithMixed} from "../types/Runner";

type CategoryGenderRanks = {
    [key in GenderWithMixed]: {
        rank: number,
        lastRunner: ProcessedRankingRunner | null,
    };
}

type CurrentRanksByCategory = {
    scratch: CategoryGenderRanks,
    team: CategoryGenderRanks,
    [key: string]: CategoryGenderRanks,
}

export class RankingProcesser {
    private ranking: Ranking;

    private processedRanking: ProcessedRanking | undefined;

    // Temporary objects to keep track of the current ranking for each category and each gender during ranking processing
    private currentRanksByCategory: CurrentRanksByCategory = {
        scratch: { // Scratch includes all solo runners regardless of their category
            mixed: {rank: 0, lastRunner: null},
            [Gender.M]: {rank: 0, lastRunner: null},
            [Gender.F]: {rank: 0, lastRunner: null},
        },
        team: {
            mixed: {rank: 0, lastRunner: null},
            // UNUSED FOR TEAMS BUT REQUIRED FOR TYPESCRIPT TYPE MATCHING (anyway we'll soon get rid of teams)
            [Gender.M]: {rank: 0, lastRunner: null},
            [Gender.F]: {rank: 0, lastRunner: null},
        }
        // Other categories will be appended here
    };

    constructor(ranking: Ranking) {
        this.ranking = ranking;
    }

    public getProcessedRanking = (): ProcessedRanking => {
        if (this.processedRanking === undefined) {
            return this.processRanking();
        }

        return this.processedRanking;
    }

    private processRanking = (): ProcessedRanking => {
        Util.verbose("Processing ranking");

        const processedRanking: ProcessedRanking = [];

        for (const runner of this.ranking) {
            const rankings: RankingRunnerRankings = {
                real: {
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
            }

            if (!this.currentRanksByCategory.hasOwnProperty(runner.category)) {
                this.addCategoryToCurrentRanks(runner.category);
            }

            if (runner.isTeam) {
                rankings.real.scratchMixed = this.currentRanksByCategory.team.mixed.rank + 1;
            } else {
                rankings.real.scratchMixed = this.currentRanksByCategory.scratch.mixed.rank + 1;
                rankings.real.scratchGender = this.currentRanksByCategory.scratch[runner.gender].rank + 1;
                rankings.real.categoryMixed = this.currentRanksByCategory[runner.category].mixed.rank + 1;
                rankings.real.categoryGender = this.currentRanksByCategory[runner.category][runner.gender].rank + 1;
            }

            let scratchMixedPreviousRunner = null;
            let scratchGenderPreviousRunner = null;
            let categoryMixedPreviousRunner = null;
            let categoryGenderPreviousRunner = null;

            if (runner.isTeam) {
                scratchMixedPreviousRunner = this.getCurrentLastRunner("team", "mixed");
            } else {
                scratchMixedPreviousRunner = this.getCurrentLastRunner("scratch", "mixed");
                scratchGenderPreviousRunner = this.getCurrentLastRunner("scratch", runner.gender);
                categoryMixedPreviousRunner = this.getCurrentLastRunner(runner.category, "mixed");
                categoryGenderPreviousRunner = this.getCurrentLastRunner(runner.category, runner.gender);
            }

            let scratchMixedPreviousRunnerEquality = this.areRunnersEqual(runner, scratchMixedPreviousRunner);
            let scratchGenderPreviousRunnerEquality = this.areRunnersEqual(runner, scratchGenderPreviousRunner);
            let categoryMixedPreviousRunnerEquality = this.areRunnersEqual(runner, categoryMixedPreviousRunner);
            let categoryGenderPreviousRunnerEquality = this.areRunnersEqual(runner, categoryGenderPreviousRunner);

            if (scratchMixedPreviousRunner && scratchMixedPreviousRunnerEquality) {
                rankings.displayed.scratchMixed = scratchMixedPreviousRunner.rankings.displayed.scratchMixed;
            } else {
                rankings.displayed.scratchMixed = rankings.real.scratchMixed;
            }

            if (!runner.isTeam) {
                if (scratchGenderPreviousRunner && scratchGenderPreviousRunnerEquality) {
                    rankings.displayed.scratchGender = scratchGenderPreviousRunner.rankings.displayed.scratchGender;
                } else {
                    rankings.displayed.scratchGender = rankings.real.scratchGender;
                }

                if (categoryMixedPreviousRunner && categoryMixedPreviousRunnerEquality) {
                    rankings.displayed.categoryMixed = categoryMixedPreviousRunner.rankings.displayed.categoryMixed;
                } else {
                    rankings.displayed.categoryMixed = rankings.real.categoryMixed;
                }

                if (categoryGenderPreviousRunner && categoryGenderPreviousRunnerEquality) {
                    rankings.displayed.categoryGender = categoryGenderPreviousRunner.rankings.displayed.categoryGender;
                } else {
                    rankings.displayed.categoryGender = rankings.real.categoryGender;
                }
            }

            let distance = 0;
            let lastPassageRaceTime = null;
            let averageSpeed = null;

            if (runner.passageCount > 0) {
                distance = app.state.firstLapDistance + app.state.lapDistance * (runner.passageCount - 1);
            }

            if (runner.lastPassageTime !== null) {
                const lastPassageTime = new Date(runner.lastPassageTime);

                lastPassageRaceTime = lastPassageTime.getTime() - app.state.raceStartTime.getTime();

                averageSpeed = (distance / (lastPassageRaceTime / 1000)) * 3.6;
            }

            const processedRankingRunner: ProcessedRankingRunner = {
                ...runner,
                distance,
                lastPassageRaceTime,
                averageSpeed,
                rankings,
            }

            this.updateCurrentRanks(processedRankingRunner);

            processedRanking.push(processedRankingRunner);
        }

        this.processedRanking = processedRanking;

        Util.verbose("Ranking processed");

        return this.processedRanking;
    }

    private getCurrentLastRunner = (category: string, gender: GenderWithMixed): ProcessedRankingRunner | null => {
        if (!this.currentRanksByCategory.hasOwnProperty(category)) {
            return null;
        }

        return this.currentRanksByCategory[category][gender].lastRunner;
    }

    private addCategoryToCurrentRanks = (category: string) => {
        if (this.currentRanksByCategory.hasOwnProperty(category)) {
            throw new Error("Category already existing in current ranks");
        }

        this.currentRanksByCategory[category] = {
            mixed: {rank: 0, lastRunner: null},
            [Gender.M]: {rank: 0, lastRunner: null},
            [Gender.F]: {rank: 0, lastRunner: null},
        };
    }

    private updateCurrentRanks = (runner: ProcessedRankingRunner) => {
        if (runner.isTeam) {
            ++this.currentRanksByCategory.team.mixed.rank;
            this.currentRanksByCategory.team.mixed.lastRunner = runner;
            return;
        }

        if (!this.currentRanksByCategory.hasOwnProperty(runner.category)) {
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
    }

    private areRunnersEqual = (runner1: RankingRunner | null, runner2: RankingRunner | null) => {
        if (runner1 === null || runner2 === null) {
            return false;
        }

        if (runner1.passageCount !== runner2.passageCount) {
            return false;
        }

        return (new Date(runner1.lastPassageTime)).getTime() === (new Date(runner2.lastPassageTime)).getTime();
    }
}
