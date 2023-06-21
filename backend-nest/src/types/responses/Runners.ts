import {Runner} from "@prisma/client";
import {PublicRunnerWithRaceAndPassages} from "../Runner";

export interface RunnersResponse {
    runners: Runner[];
}

export interface RunnerResponse {
    runner: PublicRunnerWithRaceAndPassages;
}
