import Util from "./Util";

class RankingUtil {
    static getProcessedRanking = (ranking) => {
        Util.verbose('Processing ranking');

        const processedRanking = [];

        // Initialize temporary objects to keep track of the current ranking for each category and each gender
        const currentRanksByCategory = {
            scratch: { // Scratch includes all solo runners regardless of their category
                mixed: {
                    rank: 0,
                    lastRunner: null,
                },
                M: {
                    rank: 0,
                    lastRunner: null,
                },
                F: {
                    rank: 0,
                    lastRunner: null,
                },
            },
            team: {
                mixed: {
                    rank: 0,
                    lastRunner: null,
                },
                // UNUSED FOR TEAMS
                // M: {
                //     rank: 0,
                //     lastRunner: null,
                // },
                // F: {
                //     rank: 0,
                //     lastRunner: null,
                // },
            },
            // Other categories will be appended here
        }

        const getLastRunner = (category, gender) => {
            if (!currentRanksByCategory.hasOwnProperty(category)) {
                return null;
            }

            if (!currentRanksByCategory[category].hasOwnProperty(gender)) {
                return null;
            }

            return currentRanksByCategory[category][gender].lastRunner;
        }

        const addCategoryToCurrentRanks = (categoryName) => {
            currentRanksByCategory[categoryName] = {
                mixed: {
                    rank: 0,
                    lastRunner: null,
                },
                M: {
                    rank: 0,
                    lastRunner: null,
                },
                F: {
                    rank: 0,
                    lastRunner: null,
                },
            };
        }

        const updateCurrentRanks = (runner) => {
            if (runner.isTeam) {
                ++currentRanksByCategory.team.mixed.rank;
                currentRanksByCategory.team.mixed.lastRunner = runner;
            } else {
                if (!currentRanksByCategory.hasOwnProperty(runner.category.toUpperCase())) {
                    addCategoryToCurrentRanks(runner.category.toUpperCase());
                }

                ++currentRanksByCategory.scratch.mixed.rank;
                currentRanksByCategory.scratch.mixed.lastRunner = runner;

                ++currentRanksByCategory.scratch[runner.gender.toUpperCase()].rank;
                currentRanksByCategory.scratch[runner.gender.toUpperCase()].lastRunner = runner;

                ++currentRanksByCategory[runner.category.toUpperCase()].mixed.rank;
                currentRanksByCategory[runner.category.toUpperCase()].mixed.lastRunner = runner;

                ++currentRanksByCategory[runner.category.toUpperCase()][runner.gender.toUpperCase()].rank;
                currentRanksByCategory[runner.category.toUpperCase()][runner.gender.toUpperCase()].lastRunner = runner;
            }
        }

        const areRunnersEqual = (runner1, runner2) => {
            if (runner1 === null || runner2 === null) {
                return false;
            }

            if (runner1.passageCount !== runner2.passageCount) {
                return false;
            }

            return (new Date(runner1.lastPassageTime)).getTime() === (new Date(runner2.lastPassageTime)).getTime();
        }

        for (let i = 0; i < ranking.length; ++i) {
            const runner = {...ranking[i]}; // Clone runner object to keep the original object unchanged

            runner.rankings = {
                real: {
                    scratchMixed: null,
                    scratchGender: null,
                    categoryMixed: null,
                    categoryGender: null,
                },
                displayed: { // Same as real, except in case of equality with the previous runner
                    scratchMixed: null,
                    scratchGender: null,
                    categoryMixed: null,
                    categoryGender: null,
                },
            }

            let scratchMixedPreviousRunner = null;
            let scratchGenderPreviousRunner = null;
            let categoryMixedPreviousRunner = null;
            let categoryGenderPreviousRunner = null;

            if (runner.isTeam) {
                scratchMixedPreviousRunner = getLastRunner('team', 'mixed');
            } else {
                scratchMixedPreviousRunner = getLastRunner('scratch', 'mixed');
                scratchGenderPreviousRunner = getLastRunner('scratch', runner.gender.toUpperCase());
                categoryMixedPreviousRunner = getLastRunner(runner.category.toUpperCase(), 'mixed');
                categoryGenderPreviousRunner = getLastRunner(runner.category.toUpperCase(), runner.gender.toUpperCase());
            }

            updateCurrentRanks(runner);

            if (runner.isTeam) {
                runner.rankings.real.scratchMixed = currentRanksByCategory.team.mixed.rank;
            } else {
                runner.rankings.real.scratchMixed = currentRanksByCategory.scratch.mixed.rank;
                runner.rankings.real.scratchGender = currentRanksByCategory.scratch[runner.gender.toUpperCase()].rank;
                runner.rankings.real.categoryMixed = currentRanksByCategory[runner.category.toUpperCase()].mixed.rank;
                runner.rankings.real.categoryGender = currentRanksByCategory[runner.category.toUpperCase()][runner.gender.toUpperCase()].rank;
            }

            let scratchMixedPreviousRunnerEquality = false;
            let scratchGenderPreviousRunnerEquality = false;
            let categoryMixedPreviousRunnerEquality = false;
            let categoryGenderPreviousRunnerEquality = false;

            scratchMixedPreviousRunnerEquality = areRunnersEqual(runner, scratchMixedPreviousRunner);
            scratchGenderPreviousRunnerEquality = areRunnersEqual(runner, scratchGenderPreviousRunner);
            categoryMixedPreviousRunnerEquality = areRunnersEqual(runner, categoryMixedPreviousRunner);
            categoryGenderPreviousRunnerEquality = areRunnersEqual(runner, categoryGenderPreviousRunner);

            runner.rankings.displayed.scratchMixed = scratchMixedPreviousRunnerEquality ? scratchMixedPreviousRunner.rankings.displayed.scratchMixed : runner.rankings.real.scratchMixed;

            if (!runner.isTeam) {
                runner.rankings.displayed.scratchGender = scratchGenderPreviousRunnerEquality ? scratchGenderPreviousRunner.rankings.displayed.scratchGender : runner.rankings.real.scratchGender;
                runner.rankings.displayed.categoryMixed = categoryMixedPreviousRunnerEquality ? categoryMixedPreviousRunner.rankings.displayed.categoryMixed : runner.rankings.real.categoryMixed;
                runner.rankings.displayed.categoryGender = categoryGenderPreviousRunnerEquality ? categoryGenderPreviousRunner.rankings.displayed.categoryGender : runner.rankings.real.categoryGender;
            }

            // TODO compute distance
            // TODO compute average speed

            processedRanking.push(runner)
        }

        Util.verbose('Ranking processed');

        return processedRanking;
    }
}

export default RankingUtil;
