import { type ApiRequestResult } from "../../types/api/ApiRequest";
import {
    type GetDisabledAppDataApiRequest,
    type GetPassageImportSettingsApiRequest,
    type PatchDisabledAppDataApiRequest,
    type PatchPassageImportSettingsApiRequest,
} from "../../types/api/ConfigApiRequest";
import { performAuthenticatedApiRequest } from "./ApiService";

export async function getDisabledAppData(
    accessToken: string,
): Promise<ApiRequestResult<GetDisabledAppDataApiRequest>> {
    return await performAuthenticatedApiRequest<GetDisabledAppDataApiRequest>(
        "/admin/disabled-app",
        accessToken,
    );
}

export async function patchDisabledAppData(
    accessToken: string,
    data: PatchDisabledAppDataApiRequest["payload"],
): Promise<ApiRequestResult<PatchDisabledAppDataApiRequest>> {
    return await performAuthenticatedApiRequest<PatchDisabledAppDataApiRequest>(
        "/admin/disabled-app",
        accessToken,
        data,
        { method: "PATCH" },
    );
}

export async function getPassageImportSettings(
    accessToken: string,
): Promise<ApiRequestResult<GetPassageImportSettingsApiRequest>> {
    return await performAuthenticatedApiRequest<GetPassageImportSettingsApiRequest>(
        "/admin/passage-import",
        accessToken,
    );
}

export async function patchPassageImportSettings(
    accessToken: string,
    data: PatchPassageImportSettingsApiRequest["payload"],
): Promise<ApiRequestResult<PatchPassageImportSettingsApiRequest>> {
    return await performAuthenticatedApiRequest(
        "/admin/passage-import",
        accessToken,
        data,
        { method: "PATCH" },
    );
}
