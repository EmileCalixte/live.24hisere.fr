import { type ApiRequestResult } from "../../types/api/ApiRequest";
import { type GetAdminPassagesApiRequest } from "../../types/api/PassageApiRequests";
import { performAuthenticatedApiRequest } from "./ApiService";

export async function getAdminPassages(accessToken: string): Promise<ApiRequestResult<GetAdminPassagesApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminPassagesApiRequest>("/admin/passages", accessToken);
}
