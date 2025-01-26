import type { ApiResponse, GetAppDataApiRequest } from "@live24hisere/core/types";
import { performApiRequest } from "./apiService";

export async function getAppData(): Promise<ApiResponse<GetAppDataApiRequest>> {
  return await performApiRequest<GetAppDataApiRequest>("/app-data");
}
