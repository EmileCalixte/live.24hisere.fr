import type { ApiResponse, GetPassageImportRulesAdminApiRequest } from "@live24hisere/core/types";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminPassageImportRules(
  accessToken: string,
): Promise<ApiResponse<GetPassageImportRulesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetPassageImportRulesAdminApiRequest>(
    "/admin/passage-import-rules",
    accessToken,
  );
}
