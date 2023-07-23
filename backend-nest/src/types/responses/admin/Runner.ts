import { type Runner } from "@prisma/client";
import { type AdminRunnerWithPassages } from "../../Runner";

export interface AdminRunnersResponse {
    runners: Runner[];
}

export interface AdminRunnerResponse {
    runner: Runner;
}

export interface AdminRunnerWithPassagesResponse {
    runner: AdminRunnerWithPassages;
}
