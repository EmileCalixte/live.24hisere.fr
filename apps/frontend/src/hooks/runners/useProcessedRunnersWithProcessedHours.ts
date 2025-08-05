import React from "react";
import { ONE_HOUR_IN_MILLISECONDS } from "@live24hisere/core/constants";
import type {
  PublicRace,
  RaceRunnerWithPassages,
  RaceRunnerWithProcessedData,
  RaceRunnerWithProcessedPassages,
  RunnerWithProcessedHours,
} from "@live24hisere/core/types";
import { getProcessedTimeSlotsFromPassages } from "../../utils/passageUtils";
import { useProcessedRunners } from "./useProcessedRunners";

/**
 * Returns a memoized array containing runners with processed data, passages and hours
 */
export function useProcessedRunnersWithProcessedHours<TRunner extends RaceRunnerWithPassages>(
  runners: TRunner[] | null | undefined,
  race: PublicRace | null | undefined,
  includeDistanceAfterLastPassage = true,
):
  | Array<
      RaceRunnerWithProcessedPassages<TRunner>
        & RaceRunnerWithProcessedData<TRunner>
        & RunnerWithProcessedHours<TRunner>
    >
  | undefined {
  const processedRunners = useProcessedRunners(runners, race, includeDistanceAfterLastPassage);

  return React.useMemo(
    () =>
      processedRunners?.map((runner) => ({
        ...runner,
        hours: race ? getProcessedTimeSlotsFromPassages(race, runner.passages, ONE_HOUR_IN_MILLISECONDS) : [],
      })),
    [processedRunners, race],
  );
}
