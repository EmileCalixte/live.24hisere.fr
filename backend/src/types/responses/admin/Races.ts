import { type AdminRaceWithRunnerCount } from "../../Race";

export interface AdminRacesResponse {
    races: AdminRaceWithRunnerCount[];
}

export interface AdminRaceResponse {
    race: AdminRaceWithRunnerCount;
}
