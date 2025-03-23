import type {
  ApiResponse,
  GetPassageImportRuleAdminApiRequest,
  GetPassageImportRulesAdminApiRequest,
} from "@live24hisere/core/types";
import type { UrlId } from "../../types/utils/api";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminPassageImportRules(
  accessToken: string,
): Promise<ApiResponse<GetPassageImportRulesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetPassageImportRulesAdminApiRequest>(
    "/admin/passage-import-rules",
    accessToken,
  );
}

export async function getAdminPassageImportRule(
  accessToken: string,
  ruleId: UrlId,
): Promise<ApiResponse<GetPassageImportRuleAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetPassageImportRuleAdminApiRequest>(
    `/admin/passage-import-rules/${ruleId}`,
    accessToken,
  );
}
