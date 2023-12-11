import { type DateISOString } from "src/types/Date";

export interface AppDataResponse {
    /**
     * The current server time
     */
    currentTime: DateISOString;

    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: DateISOString | null;
}
