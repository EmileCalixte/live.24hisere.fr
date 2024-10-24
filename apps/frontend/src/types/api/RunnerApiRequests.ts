import {
    type AdminPassage,
    type Runner,
    type RunnerWithPassages,
} from "@live24hisere/types";
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

export interface GetAdminRunnersApiRequest extends ApiRequest {
    payload: never;

    response: {
        runners: Runner[];
    };
}

export interface GetAdminRunnerApiRequest extends ApiRequest {
    payload: never;

    response: {
        runner: RunnerWithPassages<Runner, AdminPassage>;
    };
}

export interface PostAdminRunnerApiRequest extends ApiRequest {
    payload: Omit<Runner, "birthYear"> & { birthYear: number };

    response: {
        runner: RunnerWithPassages<Runner, AdminPassage>;
    };
}

export interface PostAdminRunnersBulkApiRequest extends ApiRequest {
    payload: Array<PostAdminRunnerApiRequest["payload"]>;

    response: {
        count: number;
    };
}

export interface PatchAdminRunnerApiRequest extends ApiRequest {
    payload: Partial<PostAdminRunnerApiRequest["payload"]>;

    response: {
        runner: Runner;
    };
}

export interface DeleteAdminRunnerApiRequest extends ApiRequest {
    payload: never;

    response: never;
}

export interface PostAdminRunnerPassageApiRequest extends ApiRequest {
    payload: Omit<AdminPassage, "id" | "detectionId" | "importTime">;

    response: {
        passage: AdminPassage;
    };
}

export interface PatchAdminRunnerPassageApiRequest extends ApiRequest {
    payload: Partial<PostAdminRunnerPassageApiRequest["payload"]>;

    response: {
        passage: AdminPassage;
    };
}

export interface DeleteAdminRunnerPassageApiRequest extends ApiRequest {
    payload: never;

    response: never;
}
