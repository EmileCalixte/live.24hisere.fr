import { type ApiRequestResult } from "../../types/api/ApiRequest";
import {
    type DeleteAdminRaceApiRequest,
    type GetAdminRaceApiRequest,
    type GetAdminRacesApiRequest,
    type GetRaceApiRequest,
    type GetRacesApiRequest,
    type PatchAdminRaceApiRequest,
    type PostAdminRaceApiRequest,
    type PutAdminRaceOrderApiRequest,
} from "../../types/api/RaceApiRequests";
import { performApiRequest, performAuthenticatedApiRequest } from "./ApiService";

export async function getRaces(): Promise<ApiRequestResult<GetRacesApiRequest>> {
    return performApiRequest<GetRacesApiRequest>("/races");
}

export async function getRace(raceId: number | string): Promise<ApiRequestResult<GetRaceApiRequest>> {
    return performApiRequest<GetRaceApiRequest>(`/races/${raceId}`);
}

export async function getAdminRaces(accessToken: string): Promise<ApiRequestResult<GetAdminRacesApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRacesApiRequest>("/admin/races", accessToken);
}

export async function getAdminRace(
    accessToken: string,
    raceId: number | string,
): Promise<ApiRequestResult<GetAdminRaceApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRaceApiRequest>(`/admin/races/${raceId}`, accessToken);
}

export async function postAdminRace(
    accessToken: string,
    race: PostAdminRaceApiRequest["payload"],
): Promise<ApiRequestResult<PostAdminRaceApiRequest>> {
    return performAuthenticatedApiRequest<PostAdminRaceApiRequest>("/admin/races", accessToken, race, {
        method: "POST",
    });
}

export async function patchAdminRace(
    accessToken: string,
    raceId: number | string,
    race: PatchAdminRaceApiRequest["payload"],
): Promise<ApiRequestResult<PatchAdminRaceApiRequest>> {
    return performAuthenticatedApiRequest<PatchAdminRaceApiRequest>(
        `/admin/races/${raceId}`,
        accessToken,
        race,
        { method: "PATCH" },
    );
}

export async function deleteAdminRace(
    accessToken: string,
    raceId: number | string,
): Promise<ApiRequestResult<DeleteAdminRaceApiRequest>> {
    return performAuthenticatedApiRequest<DeleteAdminRaceApiRequest>(
        `/admin/races/${raceId}`,
        accessToken,
        undefined,
        { method: "DELETE" },
    );
}

export async function putAdminRaceOrder(
    accessToken: string,
    raceOrder: PutAdminRaceOrderApiRequest["payload"],
): Promise<ApiRequestResult<PutAdminRaceOrderApiRequest>> {
    return performAuthenticatedApiRequest<PutAdminRaceOrderApiRequest>("/admin/races-order", accessToken, raceOrder, {
        method: "PUT",
    });
}
