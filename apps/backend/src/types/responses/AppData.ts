import { DateISOString } from "@live24hisere/core/types";

export interface AppDataResponse {
    /**
     * The current server time
     */
    currentTime: DateISOString;

    /**
     * Whether the app is accessible or not
     */
    isAppEnabled: boolean;

    /**
     * If the app is disabled, the message to be displayed
     */
    disabledAppMessage: string | null;

    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: DateISOString | null;
}
