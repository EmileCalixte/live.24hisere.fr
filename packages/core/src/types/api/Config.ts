import type { DisabledAppData, GlobalInformationMessageData, PassageImportSettings } from "../Config";
import type { ApiRequest } from "./ApiRequest";

export interface GetDisabledAppDataAdminApiRequest extends ApiRequest {
  payload: never;

  response: DisabledAppData;
}

export interface PatchDisabledAppDataAdminApiRequest extends ApiRequest {
  payload: Partial<DisabledAppData>;

  response: DisabledAppData;
}

export interface GetGlobalInformationMessageDataAdminApiRequest extends ApiRequest {
  payload: never;

  response: GlobalInformationMessageData;
}

export interface PatchGlobalInformationMessageDataAdminApiRequest extends ApiRequest {
  payload: Partial<GlobalInformationMessageData>;

  response: GlobalInformationMessageData;
}

export interface GetPassageImportSettingsAdminApiRequest extends ApiRequest {
  payload: never;

  response: PassageImportSettings;
}

export interface PatchPassageImportSettingsAdminApiRequest extends ApiRequest {
  payload: Partial<PassageImportSettings>;

  response: PassageImportSettings;
}
