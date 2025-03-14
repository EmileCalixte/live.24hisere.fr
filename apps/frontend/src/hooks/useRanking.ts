import React from "react";
import type { PublicRace } from "@live24hisere/core/types";
import { appContext } from "../contexts/AppContext";
import { RankingCalculator } from "../services/RankingCalculator";
import type { MinimalRankingRunnerInput, Ranking } from "../types/Ranking";

export function useRanking<TRunner extends MinimalRankingRunnerInput>(
  race: PublicRace | undefined,
  runners: TRunner[] | undefined,
  rankingDate?: Date,
): Ranking<TRunner> | null {
  const { serverTimeOffset } = React.useContext(appContext).appData;

  return React.useMemo<Ranking<TRunner> | null>(() => {
    if (!race || !runners) {
      return null;
    }

    const rankingCalculator = new RankingCalculator(race, runners, serverTimeOffset, rankingDate);

    return rankingCalculator.getRanking();
  }, [race, runners, serverTimeOffset, rankingDate]);
}
