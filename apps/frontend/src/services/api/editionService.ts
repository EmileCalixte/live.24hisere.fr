import type {
  ApiResponse,
  DeleteEditionAdminApiRequest,
  GetEditionAdminApiRequest,
  GetEditionsAdminApiRequest,
  GetEditionsApiRequest,
  PatchEditionAdminApiRequest,
  PostEditionAdminApiRequest,
  PutEditionOrderAdminApiRequest,
} from "@live24hisere/core/types";
import type { UrlId } from "../../types/utils/api";
import { performApiRequest, performAuthenticatedApiRequest } from "./apiService";

export async function getEditions(): Promise<ApiResponse<GetEditionsApiRequest>> {
  return await performApiRequest<GetEditionsApiRequest>("/editions");
}

export async function getAdminEditions(accessToken: string): Promise<ApiResponse<GetEditionsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetEditionsAdminApiRequest>("/admin/editions", accessToken);
}

export async function getAdminEdition(
  accessToken: string,
  editionId: UrlId,
): Promise<ApiResponse<GetEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetEditionAdminApiRequest>(`/admin/editions/${editionId}`, accessToken);
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
  editionId: UrlId,
): Promise<ApiResponse<DeleteEditionAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeleteEditionAdminApiRequest>(
    `/admin/editions/${editionId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}

export async function putAdminEditionOrder(
  accessToken: string,
  editionOrder: PutEditionOrderAdminApiRequest["payload"],
): Promise<ApiResponse<PutEditionOrderAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PutEditionOrderAdminApiRequest>(
    "/admin/editions-order",
    accessToken,
    editionOrder,
    {
      method: "PUT",
    },
  );
}
