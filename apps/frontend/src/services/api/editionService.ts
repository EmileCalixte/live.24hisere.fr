import type {
  ApiRequestResultLegacy,
  ApiResponse,
  DeleteEditionAdminApiRequest,
  GetEditionAdminApiRequest,
  GetEditionsAdminApiRequest,
  GetEditionsApiRequest,
  PatchEditionAdminApiRequest,
  PostEditionAdminApiRequest,
  PutEditionOrderAdminApiRequest,
} from "@live24hisere/core/types";
import { performApiRequest, performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getEditions(): Promise<ApiResponse<GetEditionsApiRequest>> {
  return await performApiRequest<GetEditionsApiRequest>("/editions");
}

export async function getAdminEditions(
  accessToken: string,
): Promise<ApiRequestResultLegacy<GetEditionsAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetEditionsAdminApiRequest>("/admin/editions", accessToken);
}

export async function getAdminEdition(
  accessToken: string,
  editionId: number | string,
): Promise<ApiRequestResultLegacy<GetEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetEditionAdminApiRequest>(
    `/admin/editions/${editionId}`,
    accessToken,
  );
}

export async function postAdminEdition(
  accessToken: string,
  edition: PostEditionAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PostEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PostEditionAdminApiRequest>(
    "/admin/editions",
    accessToken,
    edition,
    {
      method: "POST",
    },
  );
}

export async function patchAdminEdition(
  accessToken: string,
  editionId: number | string,
  edition: PatchEditionAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PatchEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PatchEditionAdminApiRequest>(
    `/admin/editions/${editionId}`,
    accessToken,
    edition,
    {
      method: "PATCH",
    },
  );
}

export async function deleteAdminEdition(
  accessToken: string,
  editionId: number | string,
): Promise<ApiRequestResultLegacy<DeleteEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<DeleteEditionAdminApiRequest>(
    `/admin/editions/${editionId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}

export async function putAdminEditionOrder(
  accessToken: string,
  editionOrder: PutEditionOrderAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PutEditionOrderAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PutEditionOrderAdminApiRequest>(
    "/admin/editions-order",
    accessToken,
    editionOrder,
    {
      method: "PUT",
    },
  );
}
