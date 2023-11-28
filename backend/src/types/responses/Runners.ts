import { type Runner } from "@prisma/client";
import { type PublicRunnerWithPassages } from "../Runner";

export interface RunnersResponse {
    runners: Runner[];
}

export interface RaceRunnersResponse {
    runners: PublicRunnerWithPassages[];
}
