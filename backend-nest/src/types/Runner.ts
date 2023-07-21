import { type Runner } from ".prisma/client";
import { type PublicRace } from "./Race";
import { type PublicPassage } from "./Passage";
import { type Passage, type Race } from "@prisma/client";

export interface RunnerWithRace extends Runner {
    race: Race;
}

export interface RunnerWithPassages extends Runner {
    passages: Passage[];
}

export type RunnerWithRaceAndPassages = RunnerWithRace & RunnerWithPassages;

export interface PublicRunnerWithRace extends Runner {
    race: PublicRace;
}

export interface PublicRunnerWithPassages extends Runner {
    passages: PublicPassage[];
}

export interface AdminRunnerWithPassages extends Runner {
    passages: Array<Omit<Passage, "runnerId">>;
}

export type PublicRunnerWithRaceAndPassages = PublicRunnerWithRace & PublicRunnerWithPassages;
