import {Race} from "@prisma/client";

export type PublicRace = Omit<Race, "isPublic" | "order">;

export interface PublicRaceWithRunnerCount extends PublicRace {
    runnerCount: number;
}
