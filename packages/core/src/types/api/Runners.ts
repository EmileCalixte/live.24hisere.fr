import { type AdminPassage } from "../Passage";
import { type Runner, type RunnerWithPassages } from "../Runner";
import { type ApiRequest } from "./ApiRequest";

export interface GetRunnersApiRequest extends ApiRequest {
    payload: never;

    response: {
        runners: Runner[];
    };
}

export interface GetRaceRunnersApiRequest extends ApiRequest {
    payload: never;

    response: {
        runners: RunnerWithPassages[];
    };
}

export interface GetRunnersAdminApiRequest extends ApiRequest {
    payload: never;

    response: {
        runners: Runner[];
    };
}

export interface GetRunnerAdminApiRequest extends ApiRequest {
    payload: never;

    response: {
        runner: RunnerWithPassages<Runner, AdminPassage>;
    };
}

export interface PostRunnerAdminApiRequest extends ApiRequest {
    payload: Omit<Runner, "birthYear"> & { birthYear: number };

    response: {
        runner: RunnerWithPassages<Runner, AdminPassage>;
    };
}

export interface PostRunnersBulkAdminApiRequest extends ApiRequest {
    payload: Array<PostRunnerAdminApiRequest["payload"]>;

    response: {
        count: number;
    };
}

export interface PatchRunnerAdminApiRequest extends ApiRequest {
    payload: Partial<PostRunnerAdminApiRequest["payload"]>;

    response: {
        runner: Runner;
    };
}

export interface DeleteRunnerAdminApiRequest extends ApiRequest {
    payload: never;

    response: never;
}
