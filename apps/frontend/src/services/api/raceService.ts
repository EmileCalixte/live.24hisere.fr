import type {
  ApiRequestResult,
  DeleteRaceAdminApiRequest,
  GetEditionRacesAdminApiRequest,
  GetRaceAdminApiRequest,
  GetRaceApiRequest,
  GetRacesAdminApiRequest,
  GetRacesApiRequest,
  PatchRaceAdminApiRequest,
  PostRaceAdminApiRequest,
  PutRaceOrderAdminApiRequest,
} from "@live24hisere/core/types";
import { performApiRequest, performAuthenticatedApiRequest } from "./apiService";

export async function getRaces(editionId: number): Promise<ApiRequestResult<GetRacesApiRequest>> {
  return await performApiRequest<GetRacesApiRequest>(`/races?edition=${editionId}`);
}

export async function getRace(raceId: number | string): Promise<ApiRequestResult<GetRaceApiRequest>> {
  return await performApiRequest<GetRaceApiRequest>(`/races/${raceId}`);
}

export async function getAdminRaces(accessToken: string): Promise<ApiRequestResult<GetRacesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRacesAdminApiRequest>("/admin/races", accessToken);
}

export async function getAdminEditionRaces(
  accessToken: string,
  editionId: number | string,
): Promise<ApiRequestResult<GetEditionRacesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetEditionRacesAdminApiRequest>(
    `/admin/editions/${editionId}/races`,
    accessToken,
  );
}

export async function getAdminRace(
  accessToken: string,
  raceId: number | string,
): Promise<ApiRequestResult<GetRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRaceAdminApiRequest>(`/admin/races/${raceId}`, accessToken);
}

export async function postAdminRace(
  accessToken: string,
  race: PostRaceAdminApiRequest["payload"],
): Promise<ApiRequestResult<PostRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostRaceAdminApiRequest>("/admin/races", accessToken, race, {
    method: "POST",
  });
}

export async function patchAdminRace(
  accessToken: string,
  raceId: number | string,
  race: PatchRaceAdminApiRequest["payload"],
): Promise<ApiRequestResult<PatchRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchRaceAdminApiRequest>(`/admin/races/${raceId}`, accessToken, race, {
    method: "PATCH",
  });
}

export async function deleteAdminRace(
  accessToken: string,
  raceId: number | string,
): Promise<ApiRequestResult<DeleteRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeleteRaceAdminApiRequest>(
    `/admin/races/${raceId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}

export async function putAdminRaceOrder(
  accessToken: string,
  editionId: number | string,
  raceOrder: PutRaceOrderAdminApiRequest["payload"],
): Promise<ApiRequestResult<PutRaceOrderAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PutRaceOrderAdminApiRequest>(
    `/admin/editions/${editionId}/races-order`,
    accessToken,
    raceOrder,
    {
      method: "PUT",
    },
  );
}
