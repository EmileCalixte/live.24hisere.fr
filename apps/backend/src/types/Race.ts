import { DateISOString } from "@live24hisere/types";
import { Runner } from "./Runner";

export interface Race {
    id: number;
    name: string;
    startTime: DateISOString;
    duration: number;
    initialDistance: string;
    lapDistance: string;
    order: number;
    isPublic: boolean;
}

/**
 * Public data of a race
 */
export type PublicRace = Omit<Race, "isPublic" | "order">;

/**
 * Admin data of a race
 */
export type AdminRace = Omit<Race, "order">;

/**
 * Public data of a race with list of runners
 */
export interface RaceAndRunners extends Race {
    runners: Runner[];
}

/**
 * Public data of a race with runner count
 */
export interface PublicRaceWithRunnerCount extends PublicRace {
    runnerCount: number;
}

/**
 * Admin data of a race with runner count
 */
export interface AdminRaceWithRunnerCount extends AdminRace {
    runnerCount: number;
}
