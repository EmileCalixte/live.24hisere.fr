import { type GetAdminRacesApiRequest } from "../../types/api/admin/AdminRaceApiRequests";
import { type ApiRequestResult } from "../../types/api/ApiRequest";
import { performAuthenticatedApiRequest } from "./ApiService";

export async function getAdminRaces(accessToken: string): Promise<ApiRequestResult<GetAdminRacesApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRacesApiRequest>("/admin/races", accessToken);
}
