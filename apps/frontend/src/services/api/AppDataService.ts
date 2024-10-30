import {
    type ApiRequestResult,
    type GetAppDataApiRequest,
} from "@live24hisere/core/types";
import { performApiRequest } from "./ApiService";

export async function getAppData(): Promise<
    ApiRequestResult<GetAppDataApiRequest>
> {
    return await performApiRequest<GetAppDataApiRequest>("/app-data");
}
