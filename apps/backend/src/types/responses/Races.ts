import { PublicRaceWithRunnerCount } from "src/types/Race";

export interface RacesResponse {
    races: PublicRaceWithRunnerCount[];
}

export interface RaceResponse {
    race: PublicRaceWithRunnerCount;
}
