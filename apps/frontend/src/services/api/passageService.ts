import type {
  ApiRequestResultLegacy,
  DeletePassageAdminApiRequest,
  GetAllPassagesOfRaceAdminApiRequest,
  PatchPassageAdminApiRequest,
  PostPassageAdminApiRequest,
} from "@live24hisere/core/types";
import { performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getAdminRacePassages(
  accessToken: string,
  raceId: number | string,
): Promise<ApiRequestResultLegacy<GetAllPassagesOfRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetAllPassagesOfRaceAdminApiRequest>(
    `/admin/races/${raceId}/passages`,
    accessToken,
  );
}

export async function postAdminPassage(
  accessToken: string,
  passage: PostPassageAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PostPassageAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PostPassageAdminApiRequest>(
    "/admin/passages",
    accessToken,
    passage,
    {
      method: "POST",
    },
  );
}

export async function patchAdminPassage(
  accessToken: string,
  passageId: number | string,
  passage: PatchPassageAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PatchPassageAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PatchPassageAdminApiRequest>(
    `/admin/passages/${passageId}`,
    accessToken,
    passage,
    { method: "PATCH" },
  );
}

export async function deleteAdminPassage(
  accessToken: string,
  passageId: number | string,
): Promise<ApiRequestResultLegacy<DeletePassageAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<DeletePassageAdminApiRequest>(
    `/admin/passages/${passageId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}
