import { Runner, RunnerWithPassages } from "@live24hisere/core/types";

export interface RunnersResponse {
    runners: Runner[];
}

export interface RaceRunnersResponse {
    runners: RunnerWithPassages[];
}
