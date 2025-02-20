import React from "react";
import type { PublicRace } from "@live24hisere/core/types";
import type { SelectOption } from "../types/Forms";
import { getRacesSelectOptions } from "../utils/raceUtils";

export function useRaceSelectOptions<TRace extends PublicRace>(
  races: TRace[] | undefined,
  label?: (race: TRace) => string,
): SelectOption[] {
  return React.useMemo(() => getRacesSelectOptions(races, label), [races, label]);
}
