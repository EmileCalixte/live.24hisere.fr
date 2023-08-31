import { type AdminRaceWithRunnerCount, type RaceWithRunnerCount } from "../Race";
import { type ApiRequest } from "./ApiRequest";

export interface GetRacesApiRequest extends ApiRequest {
    payload: never;

    response: {
        races: RaceWithRunnerCount[];
    };
}

export interface GetAdminRacesApiRequest extends ApiRequest {
    payload: never;

    response: {
        races: AdminRaceWithRunnerCount[];
    };
}

export interface PutAdminRaceOrderApiRequest extends ApiRequest {
    payload: number[];

    response: never;
}
