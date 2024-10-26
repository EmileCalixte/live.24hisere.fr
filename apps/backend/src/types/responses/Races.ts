import { RaceWithRunnerCount } from "@live24hisere/core/types";

export interface RacesResponse {
    races: RaceWithRunnerCount[];
}

export interface RaceResponse {
    race: RaceWithRunnerCount;
}
