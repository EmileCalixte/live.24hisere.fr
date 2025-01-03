import type {
  ApiRequestResultLegacy,
  GetDisabledAppDataAdminApiRequest,
  GetPassageImportSettingsAdminApiRequest,
  PatchDisabledAppDataAdminApiRequest,
  PatchPassageImportSettingsAdminApiRequest,
} from "@live24hisere/core/types";
import { performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getDisabledAppData(
  accessToken: string,
): Promise<ApiRequestResultLegacy<GetDisabledAppDataAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetDisabledAppDataAdminApiRequest>(
    "/admin/disabled-app",
    accessToken,
  );
}

export async function patchDisabledAppData(
  accessToken: string,
  data: PatchDisabledAppDataAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PatchDisabledAppDataAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PatchDisabledAppDataAdminApiRequest>(
    "/admin/disabled-app",
    accessToken,
    data,
    { method: "PATCH" },
  );
}

export async function getPassageImportSettings(
  accessToken: string,
): Promise<ApiRequestResultLegacy<GetPassageImportSettingsAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetPassageImportSettingsAdminApiRequest>(
    "/admin/passage-import",
    accessToken,
  );
}

export async function patchPassageImportSettings(
  accessToken: string,
  data: PatchPassageImportSettingsAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PatchPassageImportSettingsAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy("/admin/passage-import", accessToken, data, { method: "PATCH" });
}
