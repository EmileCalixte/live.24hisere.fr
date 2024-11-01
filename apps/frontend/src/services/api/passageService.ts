import { type ApiRequestResult, type GetAllPassagesAdminApiRequest } from "@live24hisere/core/types";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminPassages(accessToken: string): Promise<ApiRequestResult<GetAllPassagesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetAllPassagesAdminApiRequest>("/admin/passages", accessToken);
}
