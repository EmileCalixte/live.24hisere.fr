import { type DateISOString } from "../utils";
import { type ApiRequest } from "./ApiRequest";

export interface GetAppDataApiRequest extends ApiRequest {
  payload: never;

  response: {
    /**
     * The server time
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
     * The ID of the edition to be auto-selected
     */
    currentEditionId: number | null;

    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: DateISOString | null;
  };
}
