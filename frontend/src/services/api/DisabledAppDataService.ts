import { type ApiRequestResult } from "../../types/api/ApiRequest";
import {
    type GetDisabledAppDataApiRequest,
    type PatchDisabledAppDataApiRequest,
} from "../../types/api/DisabledAppDataApiRequest";
import { performAuthenticatedApiRequest } from "./ApiService";

export async function getDisabledAppData(
    accessToken: string,
): Promise<ApiRequestResult<GetDisabledAppDataApiRequest>> {
    return performAuthenticatedApiRequest<GetDisabledAppDataApiRequest>("/admin/disabled-app", accessToken);
}

export async function patchDisabledAppData(
    accessToken: string,
    data: PatchDisabledAppDataApiRequest["payload"],
): Promise<ApiRequestResult<PatchDisabledAppDataApiRequest>> {
    return performAuthenticatedApiRequest<PatchDisabledAppDataApiRequest>(
        "/admin/disabled-app",
        accessToken,
        data,
        { method: "PATCH" },
    );
}
