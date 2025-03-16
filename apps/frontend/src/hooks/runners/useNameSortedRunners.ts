import React from "react";
import type { PublicRunner } from "@live24hisere/core/types";
import { spaceshipRunnersByName } from "../../utils/runnerUtils";

export function useNameSortedRunners<TRunners extends PublicRunner[] | null | undefined | false>(
  runners: TRunners,
): TRunners {
  // @ts-ignore We know that the returned type is the same as the input type
  return React.useMemo(() => {
    if (!Array.isArray(runners)) {
      return runners;
    }

    return runners.toSorted(spaceshipRunnersByName);
  }, [runners]);
}
