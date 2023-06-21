import {Runner} from ".prisma/client";
import {PublicRace} from "./Race";
import {PublicPassage} from "./Passage";
import {Passage, Race} from "@prisma/client";

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

export type PublicRunnerWithRaceAndPassages = PublicRunnerWithRace & PublicRunnerWithPassages;
