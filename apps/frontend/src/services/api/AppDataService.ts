import { type ApiRequestResult } from "../../types/api/ApiRequest";
import { type GetAppDataApiRequest } from "../../types/api/AppDataApiRequests";
import { performApiRequest } from "./ApiService";

export async function getAppData(): Promise<ApiRequestResult<GetAppDataApiRequest>> {
    return await performApiRequest<GetAppDataApiRequest>("/app-data");
}
