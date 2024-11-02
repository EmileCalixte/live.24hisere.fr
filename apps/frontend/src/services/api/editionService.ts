import { type ApiRequestResult, type GetEditionsApiRequest } from "@live24hisere/core/types";
import { performApiRequest } from "./apiService";

export async function getEditions(): Promise<ApiRequestResult<GetEditionsApiRequest>> {
  return await performApiRequest<GetEditionsApiRequest>("/editions");
}
