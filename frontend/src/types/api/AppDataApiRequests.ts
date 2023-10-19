import { type PassageWithRunnerId } from "../Passage";
import { type Race } from "../Race";
import { type Runner } from "../Runner";
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

        /**
         * List of publicly visible races
         */
        races: Race[];

        /**
         * List of runners taking part in public races
         */
        runners: Runner[];

        /**
         * List of all publicly visible passages of all runners
         */
        passages: PassageWithRunnerId[];
    };
}
