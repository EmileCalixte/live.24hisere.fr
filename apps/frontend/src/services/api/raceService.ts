import type {
  ApiRequestResultLegacy,
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
import { performApiRequestLegacy, performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getRaces(editionId: number): Promise<ApiRequestResultLegacy<GetRacesApiRequest>> {
  return await performApiRequestLegacy<GetRacesApiRequest>(`/races?edition=${editionId}`);
}

export async function getRace(raceId: number | string): Promise<ApiRequestResultLegacy<GetRaceApiRequest>> {
  return await performApiRequestLegacy<GetRaceApiRequest>(`/races/${raceId}`);
}

export async function getAdminRaces(accessToken: string): Promise<ApiRequestResultLegacy<GetRacesAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetRacesAdminApiRequest>("/admin/races", accessToken);
}

export async function getAdminEditionRaces(
  accessToken: string,
  editionId: number | string,
): Promise<ApiRequestResultLegacy<GetEditionRacesAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetEditionRacesAdminApiRequest>(
    `/admin/editions/${editionId}/races`,
    accessToken,
  );
}

export async function getAdminRace(
  accessToken: string,
  raceId: number | string,
): Promise<ApiRequestResultLegacy<GetRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetRaceAdminApiRequest>(`/admin/races/${raceId}`, accessToken);
}

export async function postAdminRace(
  accessToken: string,
  race: PostRaceAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PostRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PostRaceAdminApiRequest>("/admin/races", accessToken, race, {
    method: "POST",
  });
}

export async function patchAdminRace(
  accessToken: string,
  raceId: number | string,
  race: PatchRaceAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PatchRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PatchRaceAdminApiRequest>(
    `/admin/races/${raceId}`,
    accessToken,
    race,
    {
      method: "PATCH",
    },
  );
}

export async function deleteAdminRace(
  accessToken: string,
  raceId: number | string,
): Promise<ApiRequestResultLegacy<DeleteRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<DeleteRaceAdminApiRequest>(
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
): Promise<ApiRequestResultLegacy<PutRaceOrderAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PutRaceOrderAdminApiRequest>(
    `/admin/editions/${editionId}/races-order`,
    accessToken,
    raceOrder,
    {
      method: "PUT",
    },
  );
}
