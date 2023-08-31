import { type Runner, type RunnerWithAdminPassages, type RunnerWithPassages, type RunnerWithRace } from "../Runner";
import { type ApiRequest } from "./ApiRequest";

export interface GetRunnersApiRequest extends ApiRequest {
    payload: never;

    response: {
        runners: Runner[];
    };
}

export interface GetRunnerApiRequest extends ApiRequest {
    payload: never;

    response: {
        runner: RunnerWithRace & RunnerWithPassages;
    };
}

export interface GetAdminRunnersApiRequest extends ApiRequest {
    payload: never;

    response: {
        runners: Runner[];
    };
}

export interface PostAdminRunnerApiRequest extends ApiRequest {
    payload: Omit<Runner, "birthYear"> & { birthYear: number };

    response: {
        runner: RunnerWithAdminPassages;
    };
}
