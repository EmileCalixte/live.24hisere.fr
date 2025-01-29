import type {
  ApiResponse,
  GetDisabledAppDataAdminApiRequest,
  GetPassageImportSettingsAdminApiRequest,
  PatchDisabledAppDataAdminApiRequest,
  PatchPassageImportSettingsAdminApiRequest,
} from "@live24hisere/core/types";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getDisabledAppData(accessToken: string): Promise<ApiResponse<GetDisabledAppDataAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetDisabledAppDataAdminApiRequest>("/admin/disabled-app", accessToken);
}

export async function patchDisabledAppData(
  accessToken: string,
  data: PatchDisabledAppDataAdminApiRequest["payload"],
): Promise<ApiResponse<PatchDisabledAppDataAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchDisabledAppDataAdminApiRequest>(
    "/admin/disabled-app",
    accessToken,
    data,
    { method: "PATCH" },
  );
}

export async function getPassageImportSettings(
  accessToken: string,
): Promise<ApiResponse<GetPassageImportSettingsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetPassageImportSettingsAdminApiRequest>(
    "/admin/passage-import",
    accessToken,
  );
}

export async function patchPassageImportSettings(
  accessToken: string,
  data: PatchPassageImportSettingsAdminApiRequest["payload"],
): Promise<ApiResponse<PatchPassageImportSettingsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchPassageImportSettingsAdminApiRequest>(
    "/admin/passage-import",
    accessToken,
    data,
    { method: "PATCH" },
  );
}
