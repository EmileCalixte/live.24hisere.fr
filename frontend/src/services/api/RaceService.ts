import { type ApiRequestResult } from "../../types/api/ApiRequest";
import {
    type GetAdminRacesApiRequest,
    type GetRacesApiRequest, type PostAdminRaceApiRequest,
    type PutAdminRaceOrderApiRequest,
} from "../../types/api/RaceApiRequests";
import { performApiRequest, performAuthenticatedApiRequest } from "./ApiService";

export async function getRaces(): Promise<ApiRequestResult<GetRacesApiRequest>> {
    return performApiRequest<GetRacesApiRequest>("/races");
}

export async function getAdminRaces(accessToken: string): Promise<ApiRequestResult<GetAdminRacesApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRacesApiRequest>("/admin/races", accessToken);
}

export async function postAdminRace(
    accessToken: string,
    race: PostAdminRaceApiRequest["payload"],
): Promise<ApiRequestResult<PostAdminRaceApiRequest>> {
    return performAuthenticatedApiRequest<PostAdminRaceApiRequest>("/admin/races", accessToken, race, {
        method: "POST",
    });
}

export async function putAdminRaceOrder(
    accessToken: string,
    raceOrder: PutAdminRaceOrderApiRequest["payload"],
): Promise<ApiRequestResult<PutAdminRaceOrderApiRequest>> {
    return performAuthenticatedApiRequest<PutAdminRaceOrderApiRequest>("/admin/races-order", accessToken, raceOrder, {
        method: "PUT",
    });
}
