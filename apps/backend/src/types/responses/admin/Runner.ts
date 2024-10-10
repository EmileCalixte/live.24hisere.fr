import { AdminRunnerWithPassages, Runner } from "../../Runner";

export interface AdminRunnersResponse {
    runners: Runner[];
}

export interface AdminRunnerResponse {
    runner: Runner;
}

export interface AdminRunnerWithPassagesResponse {
    runner: AdminRunnerWithPassages;
}
