import type {
  ApiResponse,
  GetDisabledAppDataAdminApiRequest,
  GetGlobalInformationMessageDataAdminApiRequest,
  PatchDisabledAppDataAdminApiRequest,
  PatchGlobalInformationMessageDataAdminApiRequest,
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

export async function getGlobalInformationMessageData(
  accessToken: string,
): Promise<ApiResponse<GetGlobalInformationMessageDataAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetGlobalInformationMessageDataAdminApiRequest>(
    "/admin/global-information-message",
    accessToken,
  );
}

export async function patchGlobalInformationMessageData(
  accessToken: string,
  data: PatchGlobalInformationMessageDataAdminApiRequest["payload"],
): Promise<ApiResponse<PatchGlobalInformationMessageDataAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchGlobalInformationMessageDataAdminApiRequest>(
    "/admin/global-information-message",
    accessToken,
    data,
    { method: "PATCH" },
  );
}
