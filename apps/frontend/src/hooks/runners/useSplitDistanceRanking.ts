import React from "react";
import type { PublicRace } from "@live24hisere/core/types";
import { SplitDistanceRankingCalculator } from "../../services/SplitDistanceRankingCalculator";
import type { MinimalRankingRunnerInput, SplitDistanceRanking } from "../../types/Ranking";

export function useSplitDistanceRanking<TRunner extends MinimalRankingRunnerInput>(
  race: PublicRace | undefined,
  runners: TRunner[] | undefined,
  /**
   * In meters
   */
  distance: number,
): SplitDistanceRanking<TRunner> | null {
  return React.useMemo<SplitDistanceRanking<TRunner> | null>(() => {
    if (!race || !runners) {
      return null;
    }

    const calculator = new SplitDistanceRankingCalculator(race, runners, distance);

    return calculator.getRanking();
  }, [race, runners, distance]);
}
