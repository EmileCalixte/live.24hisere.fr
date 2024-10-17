import { PublicRunnerWithPassages, Runner } from "../Runner";

export interface RunnersResponse {
    runners: Runner[];
}

export interface RaceRunnersResponse {
    runners: PublicRunnerWithPassages[];
}
