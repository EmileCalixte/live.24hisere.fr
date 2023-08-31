import { type RaceWithRunnerCount } from "../Race";
import { type ApiRequest } from "./ApiRequest";

export interface GetRacesApiRequest extends ApiRequest {
    payload: never;

    response: {
        races: RaceWithRunnerCount[];
    };
}
