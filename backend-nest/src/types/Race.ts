import { type Race, type Runner } from "@prisma/client";

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
