import type { ApiRequestResultLegacy, GetAppDataApiRequest } from "@live24hisere/core/types";
import { performApiRequestLegacy } from "./apiService";

export async function getAppData(): Promise<ApiRequestResultLegacy<GetAppDataApiRequest>> {
  return await performApiRequestLegacy<GetAppDataApiRequest>("/app-data");
}
