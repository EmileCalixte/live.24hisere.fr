import type {
  ApiResponse,
  GetDisabledAppDataAdminApiRequest,
  PatchDisabledAppDataAdminApiRequest,
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
