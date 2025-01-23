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
import { ENDPOINT_ADMIN_EDITIONS, ENDPOINT_PUBLIC_EDITIONS } from "../../constants/api";
import type { UrlId } from "../../types/utils/api";
import { performApiRequest, performAuthenticatedApiRequest, performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getEditions(): Promise<ApiResponse<GetEditionsApiRequest>> {
  return await performApiRequest<GetEditionsApiRequest>(ENDPOINT_PUBLIC_EDITIONS);
}

export async function getAdminEditions(accessToken: string): Promise<ApiResponse<GetEditionsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetEditionsAdminApiRequest>(ENDPOINT_ADMIN_EDITIONS, accessToken);
}

export async function getAdminEdition(
  accessToken: string,
  editionId: UrlId,
): Promise<ApiResponse<GetEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetEditionAdminApiRequest>(
    `${ENDPOINT_ADMIN_EDITIONS}/${editionId}`,
    accessToken,
  );
}

export async function postAdminEdition(
  accessToken: string,
  edition: PostEditionAdminApiRequest["payload"],
): Promise<ApiResponse<PostEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostEditionAdminApiRequest>("/admin/editions", accessToken, edition, {
    method: "POST",
  });
}

export async function patchAdminEdition(
  accessToken: string,
  editionId: UrlId,
  edition: PatchEditionAdminApiRequest["payload"],
): Promise<ApiResponse<PatchEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchEditionAdminApiRequest>(
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
