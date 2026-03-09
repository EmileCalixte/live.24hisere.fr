import React from "react";
import type {
  PublicEdition,
  RaceRunnerWithProcessedData,
  RaceRunnerWithProcessedPassages,
  RaceWithRunnerCount,
  RunnerWithProcessedHours,
} from "@live24hisere/core/types";
import type { Ranking, RankingRunner } from "../types/Ranking";

export interface RunnerDetailsViewContext {
  selectedRace: RaceWithRunnerCount | undefined;
  selectedRaceEdition: PublicEdition | undefined;
  selectedRankingRunner:
    | RankingRunner<RaceRunnerWithProcessedPassages & RunnerWithProcessedHours & RaceRunnerWithProcessedData>
    | undefined;
  ranking: Ranking | null;
}

export const runnerDetailsViewContext = React.createContext<RunnerDetailsViewContext>({
  selectedRace: undefined,
  selectedRaceEdition: undefined,
  selectedRankingRunner: undefined,
  ranking: null,
});
