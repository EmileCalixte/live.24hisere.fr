import {
  type ApiRequestResult,
  type GetRaceParticipantAdminApiRequest,
  type GetRunnerParticipationsAdminApiRequest,
  type PatchParticipantAdminApiRequest,
  type PostParticipantAdminApiRequest,
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

export async function postAdminRaceRunner(
  accessToken: string,
  raceId: number | string,
  participant: PostParticipantAdminApiRequest["payload"],
): Promise<ApiRequestResult<PostParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners`,
    accessToken,
    participant,
    { method: "POST" },
  );
}

export async function patchAdminRaceRuner(
  accessToken: string,
  raceId: number | string,
  runnerId: number | string,
  participant: PatchParticipantAdminApiRequest["payload"],
): Promise<ApiRequestResult<PatchParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners/${runnerId}`,
    accessToken,
    participant,
    { method: "PATCH" },
  );
}
