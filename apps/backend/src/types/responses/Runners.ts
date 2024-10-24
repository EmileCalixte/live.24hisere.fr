import { Runner, RunnerWithPassages } from "@live24hisere/types";

export interface RunnersResponse {
    runners: Runner[];
}

export interface RaceRunnersResponse {
    runners: RunnerWithPassages[];
}
