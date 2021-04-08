class RankingUtil {
    static getProcessedRanking = (ranking) => {
        const processedRanking = [];

        // Initialize temporary objects to keep track of the current ranking for each category and each gender

        // TODO save ranking PER CATEGORY AND PER GENDER IN RUNNER => runner.rankings[category][gender]

        const ranksByCategory = {
            scratch: { // Scratch includes all solo runners regardless of their category
                rank: 0,
                lastRunner: null,
            },
            team: { // Team is a particular category
                rank: 0,
                lastRunner: null,
            },
            // Other categories will be added in this object dynamically
        };
        const ranksByGender = {
            M: {
                rank: 0,
                lastRunner: null,
            },
            F: {
                rank: 0,
                lastRunner: null,
            },
        };

        const updateRanksByCategory = (runner, category) => {
            if (!ranksByCategory.hasOwnProperty(category)) {
                ranksByCategory[category] = {
                    rank: 0,
                    lastRunner: null,
                };
            }

            ++ranksByCategory[category].rank;
            ranksByCategory[category].lastRunner = runner;

            console.log(category, ranksByCategory[category].rank);
        }

        const updateRanksByGender = (runner, gender) => {
            if (!ranksByGender.hasOwnProperty(gender)) {
                throw new Error('Unknown gender');
            }

            ++ranksByGender[gender].rank
            ranksByGender[gender].lastRunner = runner;

            console.log(gender, ranksByGender[gender].rank);
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

        console.log(ranking);

        for (let i = 0; i < ranking.length; ++i) {
            const runner = {...ranking[i]}; // Clone runner object to keep the original object unchanged

            let scratchPreviousRunner = null;
            let categoryPreviousRunner = null;
            let genderPreviousRunner = null;

            if (runner.isTeam) {
                scratchPreviousRunner = ranksByCategory.team.lastRunner;

                updateRanksByCategory(runner, 'team');

                runner.scratchRanking = ranksByCategory.team.rank;
            } else {
                scratchPreviousRunner = ranksByCategory.scratch.lastRunner;

                if (ranksByCategory.hasOwnProperty(runner.category.toUpperCase())) {
                    categoryPreviousRunner = ranksByCategory[runner.category.toUpperCase()].lastRunner;
                }

                genderPreviousRunner = ranksByGender[runner.gender.toUpperCase()].lastRunner;

                updateRanksByCategory(runner, 'scratch');
                updateRanksByCategory(runner, runner.category.toUpperCase());
                updateRanksByGender(runner, runner.gender.toUpperCase());

                runner.scratchRanking = ranksByCategory.scratch.rank;
                runner.categoryRanking = ranksByCategory[runner.category.toUpperCase()].rank
                runner.genderRanking = ranksByGender[runner.gender.toUpperCase()].rank
            }

            console.log(ranksByCategory, ranksByGender);

            let scratchPreviousRunnerEquality = areRunnersEqual(runner, scratchPreviousRunner);
            let categoryPreviousRunnerEquality = areRunnersEqual(runner, categoryPreviousRunner);
            let genderPreviousRunnerEquality = areRunnersEqual(runner, genderPreviousRunner);

            console.log(scratchPreviousRunnerEquality, categoryPreviousRunnerEquality, genderPreviousRunnerEquality);

            runner.displayedScratchRanking = scratchPreviousRunnerEquality ? scratchPreviousRunner.displayedScratchRanking : runner.scratchRanking;

            if (!runner.isTeam) {
                runner.displayedCategoryRanking = categoryPreviousRunnerEquality ? categoryPreviousRunner.displayedCategoryRanking : runner.categoryRanking;
                runner.displayedGenderRanking = genderPreviousRunnerEquality ? genderPreviousRunner.displayedGenderRanking : runner.genderRanking;
            }

            runner.displayedScratchRanking = runner.scratchRanking; // TODO Handle equality

            // TODO compute distance
            // TODO compute average speed

            processedRanking.push(runner)
        }

        console.log(processedRanking);

        return processedRanking;
    }
}

export default RankingUtil;
