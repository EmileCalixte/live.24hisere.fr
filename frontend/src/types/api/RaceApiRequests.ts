import { type AdminRace, type AdminRaceWithRunnerCount, type RaceWithRunnerCount } from "../Race";
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

export interface GetAdminRaceApiRequest extends ApiRequest {
    payload: never;

    response: {
        race: AdminRaceWithRunnerCount;
    };
}

export interface PostAdminRaceApiRequest extends ApiRequest {
    payload: Omit<AdminRace, "id">;

    response: {
        race: AdminRaceWithRunnerCount;
    };
}

export interface PatchAdminRaceApiRequest extends ApiRequest {
    payload: Partial<PostAdminRaceApiRequest["payload"]>;

    response: {
        race: AdminRaceWithRunnerCount;
    };
}

export interface DeleteAdminRaceApiRequest extends ApiRequest {
    payload: never;

    response: never;
}

export interface PutAdminRaceOrderApiRequest extends ApiRequest {
    payload: number[];

    response: never;
}
