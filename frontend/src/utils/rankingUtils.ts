import { RankingCalculator } from "../services/RankingCalculator";
import { type Race } from "../types/Race";
import { type MinimalRankingRunnerInput, type RankingMap, type RankingRunner } from "../types/Ranking";
import { spaceship } from "./compareUtils";

/**
 * Returns rankings from a list of races and a list of runners
 */
export function getRankingMap<T extends MinimalRankingRunnerInput>(races: Race[], runners: T[]): RankingMap<T> {
    const rankingMap: RankingMap<T> = new Map();

    for (const race of races) {
        const rankingCalculator = new RankingCalculator(race, runners);

        rankingMap.set(race.id, rankingCalculator.getRanking());
    }

    return rankingMap;
}

/**
 * Returns the list of runners of a ranking sorted by ids
 */
export function getRunnersFromRankingMap<T extends MinimalRankingRunnerInput>(rankingMap: RankingMap<T>): Array<RankingRunner<T>> {
    return Array.from(rankingMap, ([, ranking]) => ranking)
        .flat()
        .sort((runnerA, runnerB) => spaceship(runnerA.id, runnerB.id));
}
