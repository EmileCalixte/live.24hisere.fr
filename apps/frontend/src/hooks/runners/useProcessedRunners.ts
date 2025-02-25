import React from "react";
import type {
  PublicRace,
  RaceRunnerWithPassages,
  RaceRunnerWithProcessedData,
  RaceRunnerWithProcessedPassages,
} from "@live24hisere/core/types";
import { getProcessedPassagesFromPassages, getRunnerProcessedDataFromPassages } from "../../utils/passageUtils";
import { getBasicRankingRunnerProcessedData } from "../../utils/runnerUtils";

/**
 * Returns a memoized array containing runners with processed data and passages
 */
export function useProcessedRunners<TRunner extends RaceRunnerWithPassages>(
  runners: TRunner[] | null | undefined,
  race: PublicRace | null | undefined,
  includeDistanceAfterLastPassage = true,
): Array<RaceRunnerWithProcessedPassages<TRunner> & RaceRunnerWithProcessedData<TRunner>> | undefined {
  return React.useMemo(() => {
    if (!runners || !race) {
      return undefined;
    }

    if (race.isBasicRanking) {
      return runners.map((runner) => ({
        ...runner,
        ...getBasicRankingRunnerProcessedData(runner, race),
        passages: [],
      }));
    }

    return runners.map((runner) => ({
      ...runner,
      ...getRunnerProcessedDataFromPassages(runner, race, runner.passages, includeDistanceAfterLastPassage),
      passages: getProcessedPassagesFromPassages(race, runner.passages),
    }));
  }, [includeDistanceAfterLastPassage, race, runners]);
}
