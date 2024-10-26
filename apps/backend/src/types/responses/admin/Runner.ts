import {
    AdminPassage,
    Runner,
    RunnerWithPassages,
} from "@live24hisere/core/types";

export interface AdminRunnersResponse {
    runners: Runner[];
}

export interface AdminRunnerResponse {
    runner: Runner;
}

export interface AdminRunnerWithPassagesResponse {
    runner: RunnerWithPassages<Runner, AdminPassage>;
}
