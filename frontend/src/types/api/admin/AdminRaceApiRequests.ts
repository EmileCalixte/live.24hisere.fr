import { type AdminRaceWithRunnerCount } from "../../Race";
import { type ApiRequest } from "../ApiRequest";

export interface GetAdminRacesApiRequest extends ApiRequest {
    payload: never;

    response: {
        races: AdminRaceWithRunnerCount[];
    };
}

// TODO other interfaces for AdminRace requests
