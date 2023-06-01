import {Race, Runner} from "@prisma/client";

export type PublicRace = Omit<Race, "isPublic" | "order">;

export interface RaceAndRunners extends Race {
    runners: Runner[];
}

export interface PublicRaceWithRunnerCount extends PublicRace {
    runnerCount: number;
}
