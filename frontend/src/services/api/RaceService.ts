import { type GetAdminRacesApiRequest, type PutAdminRaceOrderApiRequest } from "../../types/api/admin/AdminRaceApiRequests";
import { type ApiRequestResult } from "../../types/api/ApiRequest";
import { performAuthenticatedApiRequest } from "./ApiService";

export async function getAdminRaces(accessToken: string): Promise<ApiRequestResult<GetAdminRacesApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRacesApiRequest>("/admin/races", accessToken);
}

export async function putAdminRaceOrder(
    accessToken: string,
    raceOrder: PutAdminRaceOrderApiRequest["payload"],
): Promise<ApiRequestResult<PutAdminRaceOrderApiRequest>> {
    return performAuthenticatedApiRequest<PutAdminRaceOrderApiRequest>("/admin/races-order", accessToken, raceOrder, {
        method: "PUT",
    });
}
