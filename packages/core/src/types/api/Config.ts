import { type DisabledAppData, type PassageImportSettings } from "../Config";
import { type ApiRequest } from "./ApiRequest";

export interface GetDisabledAppDataAdminApiRequest extends ApiRequest {
    payload: never;

    response: DisabledAppData;
}

export interface PatchDisabledAppDataAdminApiRequest extends ApiRequest {
    payload: Partial<DisabledAppData>;

    response: DisabledAppData;
}

export interface GetPassageImportSettingsAdminApiRequest extends ApiRequest {
    payload: never;

    response: PassageImportSettings;
}

export interface PatchPassageImportSettingsAdminApiRequest extends ApiRequest {
    payload: Partial<PassageImportSettings>;

    response: PassageImportSettings;
}
