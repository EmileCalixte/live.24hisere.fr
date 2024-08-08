import { PublicRace } from "./Race";
import { AdminRunnerPassage, PublicPassage } from "./Passage";
import { Passage, Race, Runner } from "@prisma/client";

/**
 * Runner with additional data about his race
 */
export interface RunnerWithRace extends Runner {
    race: Race;
}

/**
 * Runner with list of his passages
 */
export interface RunnerWithPassages extends Runner {
    passages: Passage[];
}

/**
 * Runner with list of his passages and additional data about his race
 */
export type RunnerWithRaceAndPassages = RunnerWithRace & RunnerWithPassages;

/**
 * Public data about a runner with additional data about his race
 */
export interface PublicRunnerWithRace extends Runner {
    race: PublicRace;
}

/**
 * Public data about a runner with list of his passages
 */
export interface PublicRunnerWithPassages extends Runner {
    passages: PublicPassage[];
}

/**
 * Public data about a runner with list of his passages and additional data about his race
 */
export type PublicRunnerWithRaceAndPassages = PublicRunnerWithRace & PublicRunnerWithPassages;

/**
 * Admin data about a runner with list of his passages
 */
export interface AdminRunnerWithPassages extends Runner {
    passages: AdminRunnerPassage[];
}
