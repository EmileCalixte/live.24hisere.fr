import { type DateISOString } from "../Utils";
import { type ApiRequest } from "./ApiRequest";

export interface GetAppDataApiRequest extends ApiRequest {
    payload: never;

    response: {
        /**
         * The server time
         */
        currentTime: DateISOString;

        /**
         * Date and time the runners' data was exported from the timing system
         */
        lastUpdateTime: DateISOString;
    };
}
