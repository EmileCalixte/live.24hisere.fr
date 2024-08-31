import {
    type AdminPassage,
    type PublicRunner,
    type RunnerWithPassages,
} from "@live24hisere/types";
import { type ApiRequest } from "./ApiRequest";

export interface GetRunnersApiRequest extends ApiRequest {
    payload: never;

    response: {
        runners: PublicRunner[];
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
        runners: PublicRunner[];
    };
}

export interface GetAdminRunnerApiRequest extends ApiRequest {
    payload: never;

    response: {
        runner: RunnerWithPassages<PublicRunner, AdminPassage>;
    };
}

export interface PostAdminRunnerApiRequest extends ApiRequest {
    payload: Omit<PublicRunner, "birthYear"> & { birthYear: number };

    response: {
        runner: RunnerWithPassages<PublicRunner, AdminPassage>;
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
        runner: PublicRunner;
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
