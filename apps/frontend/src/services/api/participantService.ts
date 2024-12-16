import {
  type ApiRequestResult,
  type GetRaceParticipantAdminApiRequest,
  type GetRunnerParticipationsAdminApiRequest,
} from "@live24hisere/core/types";
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

export async function getAdminRaceRunner(
  accessToken: string,
  raceId: number | string,
  runnerId: number | string,
): Promise<ApiRequestResult<GetRaceParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRaceParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners/${runnerId}`,
    accessToken,
  );
}
