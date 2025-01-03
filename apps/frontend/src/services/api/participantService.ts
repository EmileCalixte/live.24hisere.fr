import type {
  ApiRequestResultLegacy,
  GetRaceParticipantAdminApiRequest,
  GetRunnerParticipationsAdminApiRequest,
  PatchParticipantAdminApiRequest,
  PostParticipantAdminApiRequest,
} from "@live24hisere/core/types";
import { performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getAdminRunnerParticipations(
  accessToken: string,
  runnerId: number | string,
): Promise<ApiRequestResultLegacy<GetRunnerParticipationsAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetRunnerParticipationsAdminApiRequest>(
    `/admin/runners/${runnerId}/participations`,
    accessToken,
  );
}

export async function getAdminRaceRunner(
  accessToken: string,
  raceId: number | string,
  runnerId: number | string,
): Promise<ApiRequestResultLegacy<GetRaceParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetRaceParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners/${runnerId}`,
    accessToken,
  );
}

export async function postAdminRaceRunner(
  accessToken: string,
  raceId: number | string,
  participant: PostParticipantAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PostParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PostParticipantAdminApiRequest>(
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
): Promise<ApiRequestResultLegacy<PatchParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PatchParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners/${runnerId}`,
    accessToken,
    participant,
    { method: "PATCH" },
  );
}
