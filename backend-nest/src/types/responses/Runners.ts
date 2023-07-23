import { type Runner } from "@prisma/client";
import { type PublicRunnerWithRaceAndPassages } from "../Runner";

export interface RunnersResponse {
    runners: Runner[];
}

export interface RunnerResponse {
    runner: PublicRunnerWithRaceAndPassages;
}
