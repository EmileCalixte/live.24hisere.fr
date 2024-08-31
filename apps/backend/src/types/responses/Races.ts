import { RaceWithRunnerCount } from "@live24hisere/types";

export interface RacesResponse {
    races: RaceWithRunnerCount[];
}

export interface RaceResponse {
    race: RaceWithRunnerCount;
}
