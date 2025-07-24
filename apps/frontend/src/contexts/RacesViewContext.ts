import React from "react";
import type { EditionWithRaceCount, RaceRunnerWithPassages, RaceWithRunnerCount } from "@live24hisere/core/types";

export interface RacesViewContext {
  selectedEdition: EditionWithRaceCount | null;
  selectedRace: RaceWithRunnerCount | null;
  selectedRaceRunners: RaceRunnerWithPassages[] | null;
}

export const racesViewContext = React.createContext<RacesViewContext>({
  selectedEdition: null,
  selectedRace: null,
  selectedRaceRunners: null,
});
