import { AdminRace, RaceWithRunnerCount } from "@live24hisere/types";

export interface AdminRacesResponse {
    races: Array<RaceWithRunnerCount<AdminRace>>;
}

export interface AdminRaceResponse {
    race: RaceWithRunnerCount<AdminRace>;
}
