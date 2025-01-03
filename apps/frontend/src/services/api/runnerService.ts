import type {
  ApiRequestResultLegacy,
  DeleteRunnerAdminApiRequest,
  GetRaceRunnersAdminApiRequest,
  GetRaceRunnersApiRequest,
  GetRunnerAdminApiRequest,
  GetRunnersAdminApiRequest,
  GetRunnersApiRequest,
  PatchRunnerAdminApiRequest,
  PostRunnerAdminApiRequest,
  PostRunnersBulkAdminApiRequest,
} from "@live24hisere/core/types";
import { performApiRequestLegacy, performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getRunners(): Promise<ApiRequestResultLegacy<GetRunnersApiRequest>> {
  return await performApiRequestLegacy<GetRunnersApiRequest>("/runners");
}

export async function getRaceRunners(
  raceId: number | string,
): Promise<ApiRequestResultLegacy<GetRaceRunnersApiRequest>> {
  return await performApiRequestLegacy<GetRaceRunnersApiRequest>(`/races/${raceId}/runners`);
}

export async function getAdminRunners(accessToken: string): Promise<ApiRequestResultLegacy<GetRunnersAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetRunnersAdminApiRequest>("/admin/runners", accessToken);
}

export async function getAdminRunner(
  accessToken: string,
  runnerId: number | string,
): Promise<ApiRequestResultLegacy<GetRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetRunnerAdminApiRequest>(
    `/admin/runners/${runnerId}`,
    accessToken,
  );
}

export async function postAdminRunner(
  accessToken: string,
  runner: PostRunnerAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PostRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PostRunnerAdminApiRequest>("/admin/runners", accessToken, runner, {
    method: "POST",
  });
}

export async function postAdminRunnersBulk(
  accessToken: string,
  runners: PostRunnersBulkAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PostRunnersBulkAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PostRunnersBulkAdminApiRequest>(
    "/admin/runners-bulk",
    accessToken,
    runners,
    {
      method: "POST",
    },
  );
}

export async function patchAdminRunner(
  accessToken: string,
  runnerId: number | string,
  runner: PatchRunnerAdminApiRequest["payload"],
): Promise<ApiRequestResultLegacy<PatchRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<PatchRunnerAdminApiRequest>(
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
  runnerId: number | string,
): Promise<ApiRequestResultLegacy<DeleteRunnerAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<DeleteRunnerAdminApiRequest>(
    `/admin/runners/${runnerId}`,
    accessToken,
    undefined,
    {
      method: "DELETE",
    },
  );
}

// export async function postAdminRunnerPassage(
//   accessToken: string,
//   runnerId: number | string,
//   passage: PostRunnerPassageAdminApiRequest["payload"],
// ): Promise<ApiRequestResult<PostRunnerPassageAdminApiRequest>> {
//   return await performAuthenticatedApiRequest<PostRunnerPassageAdminApiRequest>(
//     `/admin/runners/${runnerId}/passages`,
//     accessToken,
//     passage,
//     { method: "POST" },
//   );
// }

// export async function patchAdminRunnerPassage(
//   accessToken: string,
//   runnerId: number | string,
//   passageId: number | string,
//   passage: PatchRunnerPassageAdminApiRequest["payload"],
// ): Promise<ApiRequestResult<PatchRunnerPassageAdminApiRequest>> {
//   return await performAuthenticatedApiRequest<PatchRunnerPassageAdminApiRequest>(
//     `/admin/runners/${runnerId}/passages/${passageId}`,
//     accessToken,
//     passage,
//     { method: "PATCH" },
//   );
// }

// export async function deleteAdminRunnerPassage(
//   accessToken: string,
//   runnerId: number | string,
//   passageId: number | string,
// ): Promise<ApiRequestResult<DeleteAdminRunnerPassageApiRequest>> {
//   return await performAuthenticatedApiRequest<DeleteAdminRunnerPassageApiRequest>(
//     `/admin/runners/${runnerId}/passages/${passageId}`,
//     accessToken,
//     undefined,
//     { method: "DELETE" },
//   );
// }

export async function getAdminRaceRunners(
  accessToken: string,
  raceId: number | string,
): Promise<ApiRequestResultLegacy<GetRaceRunnersAdminApiRequest>> {
  return await performAuthenticatedApiRequestLegacy<GetRaceRunnersAdminApiRequest>(
    `/admin/races/${raceId}/runners`,
    accessToken,
  );
}
