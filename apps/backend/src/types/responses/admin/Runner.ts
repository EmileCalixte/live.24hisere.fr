import { Runner } from "@prisma/client";
import {
    AdminPassage,
    PublicRunner,
    RunnerWithPassages,
} from "@live24hisere/types";

export interface AdminRunnersResponse {
    runners: Runner[];
}

export interface AdminRunnerResponse {
    runner: Runner;
}

export interface AdminRunnerWithPassagesResponse {
    runner: RunnerWithPassages<PublicRunner, AdminPassage>;
}
