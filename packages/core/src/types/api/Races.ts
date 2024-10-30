import {
    type AdminRace,
    type AdminRaceWithRunnerCount,
    type RaceWithRunnerCount,
} from "../Race";
import { type ApiRequest } from "./ApiRequest";

export interface GetRacesApiRequest extends ApiRequest {
    payload: never;

    response: {
        races: RaceWithRunnerCount[];
    };
}

export interface GetRaceApiRequest extends ApiRequest {
    payload: never;

    response: {
        race: RaceWithRunnerCount;
    };
}

export interface GetRacesAdminApiRequest extends ApiRequest {
    payload: never;

    response: {
        races: AdminRaceWithRunnerCount[];
    };
}

export interface GetRaceAdminApiRequest extends ApiRequest {
    payload: never;

    response: {
        race: AdminRaceWithRunnerCount;
    };
}

export interface PostRaceAdminApiRequest extends ApiRequest {
    payload: Omit<AdminRace, "id">;

    response: {
        race: AdminRaceWithRunnerCount;
    };
}

export interface PatchRaceAdminApiRequest extends ApiRequest {
    payload: Partial<PostRaceAdminApiRequest["payload"]>;

    response: {
        race: AdminRaceWithRunnerCount;
    };
}

export interface DeleteRaceAdminApiRequest extends ApiRequest {
    payload: never;

    response: never;
}

export interface PutRaceOrderAdminApiRequest extends ApiRequest {
    payload: number[];

    response: never;
}
