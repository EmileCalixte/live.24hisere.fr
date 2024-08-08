import { Runner } from "@prisma/client";
import { PublicRunnerWithPassages } from "../Runner";

export interface RunnersResponse {
    runners: Runner[];
}

export interface RaceRunnersResponse {
    runners: PublicRunnerWithPassages[];
}
