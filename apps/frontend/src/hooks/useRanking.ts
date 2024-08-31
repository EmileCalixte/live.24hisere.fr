import { useMemo } from "react";
import { type Race } from "@live24hisere/types";
import { RankingCalculator } from "../services/RankingCalculator";
import { type MinimalRankingRunnerInput, type Ranking } from "../types/Ranking";

export function useRanking<TRunner extends MinimalRankingRunnerInput>(
    race: Race | undefined,
    runners: TRunner[] | undefined,
    rankingDate?: Date,
): Ranking<TRunner> | null {
    return useMemo<Ranking<TRunner> | null>(() => {
        if (!race || !runners) {
            return null;
        }

        const rankingCalculator = new RankingCalculator(
            race,
            runners,
            rankingDate,
        );

        return rankingCalculator.getRanking();
    }, [race, runners, rankingDate]);
}
