import type {
  ApiResponse,
  GetRaceParticipantAdminApiRequest,
  GetRunnerParticipationsAdminApiRequest,
  PatchParticipantAdminApiRequest,
  PostParticipantAdminApiRequest,
} from "@live24hisere/core/types";
import type { UrlId } from "../../types/utils/api";
import { performAuthenticatedApiRequest } from "./apiService";

export async function getAdminRunnerParticipations(
  accessToken: string,
  runnerId: UrlId,
): Promise<ApiResponse<GetRunnerParticipationsAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRunnerParticipationsAdminApiRequest>(
    `/admin/runners/${runnerId}/participations`,
    accessToken,
  );
}

export async function getAdminRaceRunner(
  accessToken: string,
  raceId: UrlId,
  runnerId: UrlId,
): Promise<ApiResponse<GetRaceParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRaceParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners/${runnerId}`,
    accessToken,
  );
}

export async function postAdminRaceRunner(
  accessToken: string,
  raceId: UrlId,
  participant: PostParticipantAdminApiRequest["payload"],
): Promise<ApiResponse<PostParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners`,
    accessToken,
    participant,
    { method: "POST" },
  );
}

export async function patchAdminRaceRuner(
  accessToken: string,
  raceId: UrlId,
  runnerId: UrlId,
  participant: PatchParticipantAdminApiRequest["payload"],
): Promise<ApiResponse<PatchParticipantAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchParticipantAdminApiRequest>(
    `/admin/races/${raceId}/runners/${runnerId}`,
    accessToken,
    participant,
    { method: "PATCH" },
  );
}
