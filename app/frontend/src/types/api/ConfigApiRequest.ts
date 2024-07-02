import { type DisabledAppData, type PassageImportSettings } from "../Config";
import { type ApiRequest } from "./ApiRequest";

export interface GetDisabledAppDataApiRequest extends ApiRequest {
    payload: never;

    response: DisabledAppData;
}

export interface PatchDisabledAppDataApiRequest extends ApiRequest {
    payload: Partial<DisabledAppData>;

    response: DisabledAppData;
}

export interface GetPassageImportSettingsApiRequest extends ApiRequest {
    payload: never;

    response: PassageImportSettings;
}

export interface PatchPassageImportSettingsApiRequest extends ApiRequest {
    payload: Partial<PassageImportSettings>;

    response: PassageImportSettings;
}
