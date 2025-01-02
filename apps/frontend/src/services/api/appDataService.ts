import type { ApiRequestResult, GetAppDataApiRequest } from "@live24hisere/core/types";
import { performApiRequest } from "./apiService";

export async function getAppData(): Promise<ApiRequestResult<GetAppDataApiRequest>> {
  return await performApiRequest<GetAppDataApiRequest>("/app-data");
}
