import { PublicRaceWithRunnerCount } from "../Race";

export interface RacesResponse {
    races: PublicRaceWithRunnerCount[];
}

export interface RaceResponse {
    race: PublicRaceWithRunnerCount;
}
