import {
  type ApiRequestResult,
  type GetDisabledAppDataAdminApiRequest,
  type GetPassageImportSettingsAdminApiRequest,
  type PatchDisabledAppDataAdminApiRequest,
  type PatchPassageImportSettingsAdminApiRequest,
} from "@live24hisere/core/types";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getDisabledAppData(
  accessToken: string,
): Promise<ApiRequestResult<GetDisabledAppDataAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetDisabledAppDataAdminApiRequest>("/admin/disabled-app", accessToken);
}

export async function patchDisabledAppData(
  accessToken: string,
  data: PatchDisabledAppDataAdminApiRequest["payload"],
): Promise<ApiRequestResult<PatchDisabledAppDataAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchDisabledAppDataAdminApiRequest>(
    "/admin/disabled-app",
    accessToken,
    data,
    { method: "PATCH" },
  );
}

export async function getPassageImportSettings(
  accessToken: string,
): Promise<ApiRequestResult<GetPassageImportSettingsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetPassageImportSettingsAdminApiRequest>(
    "/admin/passage-import",
    accessToken,
  );
}

export async function patchPassageImportSettings(
  accessToken: string,
  data: PatchPassageImportSettingsAdminApiRequest["payload"],
): Promise<ApiRequestResult<PatchPassageImportSettingsAdminApiRequest>> {
  return await performAuthenticatedApiRequest("/admin/passage-import", accessToken, data, { method: "PATCH" });
}
