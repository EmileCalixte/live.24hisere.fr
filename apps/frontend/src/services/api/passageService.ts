import type {
  ApiRequestResult,
  DeletePassageAdminApiRequest,
  GetAllPassagesOfRaceAdminApiRequest,
  PatchPassageAdminApiRequest,
  PostPassageAdminApiRequest,
} from "@live24hisere/core/types";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminRacePassages(
  accessToken: string,
  raceId: number | string,
): Promise<ApiRequestResult<GetAllPassagesOfRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetAllPassagesOfRaceAdminApiRequest>(
    `/admin/races/${raceId}/passages`,
    accessToken,
  );
}

export async function postAdminPassage(
  accessToken: string,
  passage: PostPassageAdminApiRequest["payload"],
): Promise<ApiRequestResult<PostPassageAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostPassageAdminApiRequest>("/admin/passages", accessToken, passage, {
    method: "POST",
  });
}

export async function patchAdminPassage(
  accessToken: string,
  passageId: number | string,
  passage: PatchPassageAdminApiRequest["payload"],
): Promise<ApiRequestResult<PatchPassageAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchPassageAdminApiRequest>(
    `/admin/passages/${passageId}`,
    accessToken,
    passage,
    { method: "PATCH" },
  );
}

export async function deleteAdminPassage(
  accessToken: string,
  passageId: number | string,
): Promise<ApiRequestResult<DeletePassageAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeletePassageAdminApiRequest>(
    `/admin/passages/${passageId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}
