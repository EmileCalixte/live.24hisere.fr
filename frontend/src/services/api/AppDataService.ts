import { type ApiRequestResult } from "../../types/api/ApiRequest";
import { type GetAppDataApiRequest } from "../../types/api/AppDataApiRequest";
import { performApiRequest } from "./ApiService";

export async function getAppData(): Promise<ApiRequestResult<GetAppDataApiRequest>> {
    return performApiRequest<GetAppDataApiRequest>("/app-data");
}
