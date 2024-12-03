import { type ApiRequestResult, type GetRunnerParticipationsAdminApiRequest } from "@live24hisere/core/types";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminRunnerParticipations(
  accessToken: string,
  runnerId: number | string,
): Promise<ApiRequestResult<GetRunnerParticipationsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRunnerParticipationsAdminApiRequest>(
    `/admin/runners/${runnerId}/participations`,
    accessToken,
  );
}
