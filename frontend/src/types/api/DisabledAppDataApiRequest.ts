import { type DisabledAppData } from "../DisabledAppData";
import { type ApiRequest } from "./ApiRequest";

export interface GetDisabledAppDataApiRequest extends ApiRequest {
    payload: never;

    response: DisabledAppData;
}

export interface PatchDisabledAppDataApiRequest extends ApiRequest {
    payload: Partial<DisabledAppData>;

    response: DisabledAppData;
}
