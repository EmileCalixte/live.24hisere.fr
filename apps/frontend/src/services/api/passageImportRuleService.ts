import type {
  ApiResponse,
  DeletePassageImportRuleAdminApiRequest,
  GetPassageImportRuleAdminApiRequest,
  GetPassageImportRulesAdminApiRequest,
  PatchPassageImportRuleAdminApiRequest,
  PostPassageImportRuleAdminApiRequest,
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

export async function postAdminPassageImportRule(
  accessToken: string,
  rule: PostPassageImportRuleAdminApiRequest["payload"],
): Promise<ApiResponse<PostPassageImportRuleAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostPassageImportRuleAdminApiRequest>(
    "/admin/passage-import-rules",
    accessToken,
    rule,
    { method: "POST" },
  );
}

export async function patchAdminPassageImportRule(
  accessToken: string,
  ruleId: UrlId,
  rule: PatchPassageImportRuleAdminApiRequest["payload"],
): Promise<ApiResponse<PatchPassageImportRuleAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchPassageImportRuleAdminApiRequest>(
    `/admin/passage-import-rules/${ruleId}`,
    accessToken,
    rule,
    { method: "PATCH" },
  );
}

export async function deleteAdminPassageImportRule(
  accessToken: string,
  ruleId: UrlId,
): Promise<ApiResponse<DeletePassageImportRuleAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeletePassageImportRuleAdminApiRequest>(
    `/admin/passage-import-rules/${ruleId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}
