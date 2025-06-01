import type {
  ApiResponse,
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
import type { UrlId } from "../../types/utils/api";
import { performApiRequest, performAuthenticatedApiRequest } from "./apiService";

export async function getRaces(): Promise<ApiResponse<GetRacesApiRequest>> {
  return await performApiRequest<GetRacesApiRequest>("/races");
}

export async function getEditionRaces(editionId: UrlId): Promise<ApiResponse<GetRacesApiRequest>> {
  return await performApiRequest<GetRacesApiRequest>(`/editions/${editionId}/races`);
}

export async function getRace(raceId: UrlId): Promise<ApiResponse<GetRaceApiRequest>> {
  return await performApiRequest<GetRaceApiRequest>(`/races/${raceId}`);
}

export async function getAdminRaces(accessToken: string): Promise<ApiResponse<GetRacesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRacesAdminApiRequest>("/admin/races", accessToken);
}

export async function getAdminEditionRaces(
  accessToken: string,
  editionId: UrlId,
): Promise<ApiResponse<GetEditionRacesAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetEditionRacesAdminApiRequest>(
    `/admin/editions/${editionId}/races`,
    accessToken,
  );
}

export async function getAdminRace(accessToken: string, raceId: UrlId): Promise<ApiResponse<GetRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRaceAdminApiRequest>(`/admin/races/${raceId}`, accessToken);
}

export async function postAdminRace(
  accessToken: string,
  race: PostRaceAdminApiRequest["payload"],
): Promise<ApiResponse<PostRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostRaceAdminApiRequest>("/admin/races", accessToken, race, {
    method: "POST",
  });
}

export async function patchAdminRace(
  accessToken: string,
  raceId: UrlId,
  race: PatchRaceAdminApiRequest["payload"],
): Promise<ApiResponse<PatchRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchRaceAdminApiRequest>(`/admin/races/${raceId}`, accessToken, race, {
    method: "PATCH",
  });
}

export async function deleteAdminRace(
  accessToken: string,
  raceId: UrlId,
): Promise<ApiResponse<DeleteRaceAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeleteRaceAdminApiRequest>(
    `/admin/races/${raceId}`,
    accessToken,
    undefined,
    { method: "DELETE" },
  );
}

export async function putAdminRaceOrder(
  accessToken: string,
  editionId: UrlId,
  raceOrder: PutRaceOrderAdminApiRequest["payload"],
): Promise<ApiResponse<PutRaceOrderAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PutRaceOrderAdminApiRequest>(
    `/admin/editions/${editionId}/races-order`,
    accessToken,
    raceOrder,
    { method: "PUT" },
  );
}
