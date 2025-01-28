import type {
  ApiResponse,
  DeleteRunnerAdminApiRequest,
  GetRaceRunnersAdminApiRequest,
  GetRaceRunnersApiRequest,
  GetRunnerAdminApiRequest,
  GetRunnersAdminApiRequest,
  GetRunnersApiRequest,
  PatchRunnerAdminApiRequest,
  PostRunnerAdminApiRequest,
} from "@live24hisere/core/types";
import type { UrlId } from "../../types/utils/api";
import { performApiRequest, performAuthenticatedApiRequest } from "./apiService";

export async function getRunners(): Promise<ApiResponse<GetRunnersApiRequest>> {
  return await performApiRequest<GetRunnersApiRequest>("/runners");
}

export async function getRaceRunners(raceId: UrlId): Promise<ApiResponse<GetRaceRunnersApiRequest>> {
  return await performApiRequest<GetRaceRunnersApiRequest>(`/races/${raceId}/runners`);
}

export async function getAdminRunners(accessToken: string): Promise<ApiResponse<GetRunnersAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRunnersAdminApiRequest>("/admin/runners", accessToken);
}

export async function getAdminRunner(
  accessToken: string,
  runnerId: UrlId,
): Promise<ApiResponse<GetRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRunnerAdminApiRequest>(`/admin/runners/${runnerId}`, accessToken);
}

export async function postAdminRunner(
  accessToken: string,
  runner: PostRunnerAdminApiRequest["payload"],
): Promise<ApiResponse<PostRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PostRunnerAdminApiRequest>("/admin/runners", accessToken, runner, {
    method: "POST",
  });
}

export async function patchAdminRunner(
  accessToken: string,
  runnerId: UrlId,
  runner: PatchRunnerAdminApiRequest["payload"],
): Promise<ApiResponse<PatchRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequest<PatchRunnerAdminApiRequest>(
    `/admin/runners/${runnerId}`,
    accessToken,
    runner,
    {
      method: "PATCH",
    },
  );
}

export async function deleteAdminRunner(
  accessToken: string,
  runnerId: UrlId,
): Promise<ApiResponse<DeleteRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequest<DeleteRunnerAdminApiRequest>(
    `/admin/runners/${runnerId}`,
    accessToken,
    undefined,
    {
      method: "DELETE",
    },
  );
}

export async function getAdminRaceRunners(
  accessToken: string,
  raceId: UrlId,
): Promise<ApiResponse<GetRaceRunnersAdminApiRequest>> {
  return await performAuthenticatedApiRequest<GetRaceRunnersAdminApiRequest>(
    `/admin/races/${raceId}/runners`,
    accessToken,
  );
}
