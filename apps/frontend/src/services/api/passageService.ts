import type {
  ApiResponse,
  DeletePassageAdminApiRequest,
  GetAllPassagesOfRaceAdminApiRequest,
  PatchPassageAdminApiRequest,
  PostPassageAdminApiRequest,
} from "@live24hisere/core/types";
import type { UrlId } from "../../types/utils/api";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminRacePassages(
  accessToken: string,
  raceId: UrlId,
): Promise<ApiResponse<GetAllPassagesOfRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetAllPassagesOfRaceAdminApiRequest>(
    `/admin/races/${raceId}/passages`,
    accessToken,
  );
}

export async function postAdminPassage(
  accessToken: string,
  passage: PostPassageAdminApiRequest["payload"],
): Promise<ApiResponse<PostPassageAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostPassageAdminApiRequest>("/admin/passages", accessToken, passage, {
    method: "POST",
  });
}

export async function patchAdminPassage(
  accessToken: string,
  passageId: UrlId,
  passage: PatchPassageAdminApiRequest["payload"],
): Promise<ApiResponse<PatchPassageAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchPassageAdminApiRequest>(
    `/admin/passages/${passageId}`,
    accessToken,
    passage,
    { method: "PATCH" },
  );
}

export async function deleteAdminPassage(
  accessToken: string,
  passageId: UrlId,
): Promise<ApiResponse<DeletePassageAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeletePassageAdminApiRequest>(
    `/admin/passages/${passageId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}
