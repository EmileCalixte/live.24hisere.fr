import React from "react";
import type { EditionWithRaceCount, RaceWithRunnerCount } from "@live24hisere/core/types";

export interface RacesViewContext {
  selectedEdition: EditionWithRaceCount | null;
  selectedRace: RaceWithRunnerCount | null;
}

export const racesViewContext = React.createContext<RacesViewContext>({
  selectedEdition: null,
  selectedRace: null,
});
