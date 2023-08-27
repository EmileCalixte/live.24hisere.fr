import { type AdminRaceWithRunnerCount } from "../../Race";
import { type ApiRequest } from "../ApiRequest";

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
