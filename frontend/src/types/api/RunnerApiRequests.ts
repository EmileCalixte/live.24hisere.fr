import { type Runner, type RunnerWithPassages, type RunnerWithRace } from "../Runner";
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
