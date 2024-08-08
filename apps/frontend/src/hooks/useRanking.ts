import { useMemo } from "react";
import { RankingCalculator } from "../services/RankingCalculator";
import { type Race } from "../types/Race";
import { type MinimalRankingRunnerInput, type Ranking } from "../types/Ranking";

export function useRanking<T extends MinimalRankingRunnerInput>(race: Race | undefined, runners: T[] | undefined, rankingDate?: Date): Ranking<T> | null {
    return useMemo<Ranking<T> | null>(() => {
        if (!race || !runners) {
            return null;
        }

        const rankingCalculator = new RankingCalculator(race, runners, rankingDate);

        return rankingCalculator.getRanking();
    }, [race, runners, rankingDate]);
}
