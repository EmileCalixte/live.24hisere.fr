import { type Runner } from "@prisma/client";
import { type DateISOString } from "src/types/Date";
import { type PublicPassageWithRunnerId } from "../Passage";
import { type PublicRace } from "../Race";

export interface AppDataResponse {
    /**
     * The current server time
     */
    currentTime: DateISOString;

    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: DateISOString | null;

    /**
     * List of publicly visible races
     */
    races: PublicRace[];

    /**
     * List of runners taking part in public races
     */
    runners: Runner[];

    /**
     * List of all publicly visible passages of all runners
     */
    passages: PublicPassageWithRunnerId[];
}
