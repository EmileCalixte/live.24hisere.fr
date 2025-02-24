import React from "react";
import type {
  PublicRace,
  RaceRunnerWithPassages,
  RaceRunnerWithProcessedData,
  RaceRunnerWithProcessedPassages,
  RunnerWithProcessedHours,
} from "@live24hisere/core/types";
import { getProcessedHoursFromPassages } from "../../utils/passageUtils";
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
        hours: race ? getProcessedHoursFromPassages(race, runner.passages) : [],
      })),
    [processedRunners, race],
  );
}
