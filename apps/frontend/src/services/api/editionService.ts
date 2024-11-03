import {
  type ApiRequestResult,
  type GetEditionsAdminApiRequest,
  type GetEditionsApiRequest,
  type PutEditionOrderAdminApiRequest,
} from "@live24hisere/core/types";
import { performApiRequest, performAuthenticatedApiRequest } from "./apiService";

export async function getEditions(): Promise<ApiRequestResult<GetEditionsApiRequest>> {
  return await performApiRequest<GetEditionsApiRequest>("/editions");
}

export async function getAdminEditions(accessToken: string): Promise<ApiRequestResult<GetEditionsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetEditionsAdminApiRequest>("/admin/editions", accessToken);
}

export async function putAdminEditionOrder(
  accessToken: string,
  editionOrder: PutEditionOrderAdminApiRequest["payload"],
): Promise<ApiRequestResult<PutEditionOrderAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PutEditionOrderAdminApiRequest>(
    "/admin/editions-order",
    accessToken,
    editionOrder,
    {
      method: "PUT",
    },
  );
}
