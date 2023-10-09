import { RankingCalculator } from "../services/RankingCalculator";
import { type PassageWithRunnerId } from "../types/Passage";
import { type Race } from "../types/Race";
import { type RankingMap, type RankingRunner } from "../types/Ranking";
import { type Runner } from "../types/Runner";
import { spaceship } from "../util/compareUtils";

export function getRankingMap(races: Race[], runners: Runner[], passages: PassageWithRunnerId[]): RankingMap {
    const rankingMap: RankingMap = new Map();

    for (const race of races) {
        const rankingCalculator = new RankingCalculator(race, runners, passages);

        rankingMap.set(race.id, rankingCalculator.getRanking());
    }

    return rankingMap;
}

export function getRunnersFromRankingMap(rankingMap: RankingMap): RankingRunner[] {
    return Array.from(rankingMap, ([, ranking]) => ranking)
        .flat()
        .sort((runnerA, runnerB) => spaceship(runnerA.id, runnerB.id));
}
