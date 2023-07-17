import { type Race, type Runner } from "@prisma/client";

export type PublicRace = Omit<Race, "isPublic" | "order">;

export type AdminRace = Omit<Race, "order">;

export interface RaceAndRunners extends Race {
    runners: Runner[];
}

export interface PublicRaceWithRunnerCount extends PublicRace {
    runnerCount: number;
}

export interface AdminRaceWithRunnerCount extends AdminRace {
    runnerCount: number;
}
