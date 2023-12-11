import { type ApiRequestResult } from "../../types/api/ApiRequest";
import {
    type DeleteAdminRunnerApiRequest,
    type DeleteAdminRunnerPassageApiRequest,
    type GetAdminRunnerApiRequest,
    type GetAdminRunnersApiRequest,
    type GetRaceRunnersApiRequest,
    type GetRunnersApiRequest,
    type PatchAdminRunnerApiRequest,
    type PatchAdminRunnerPassageApiRequest,
    type PostAdminRunnerApiRequest,
    type PostAdminRunnerPassageApiRequest,
} from "../../types/api/RunnerApiRequests";
import { performApiRequest, performAuthenticatedApiRequest } from "./ApiService";

export async function getRunners(): Promise<ApiRequestResult<GetRunnersApiRequest>> {
    return performApiRequest<GetRunnersApiRequest>("/runners");
}

export async function getRaceRunners(raceId: number | string): Promise<ApiRequestResult<GetRaceRunnersApiRequest>> {
    return performApiRequest<GetRaceRunnersApiRequest>(`/races/${raceId}/runners`);
}

export async function getAdminRunners(accessToken: string): Promise<ApiRequestResult<GetAdminRunnersApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRunnersApiRequest>("/admin/runners", accessToken);
}

export async function getAdminRunner(
    accessToken: string,
    runnerId: number | string,
): Promise<ApiRequestResult<GetAdminRunnerApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRunnerApiRequest>(`/admin/runners/${runnerId}`, accessToken);
}

export async function postAdminRunner(
    accessToken: string,
    runner: PostAdminRunnerApiRequest["payload"],
): Promise<ApiRequestResult<PostAdminRunnerApiRequest>> {
    return performAuthenticatedApiRequest<PostAdminRunnerApiRequest>("/admin/runners", accessToken, runner, {
        method: "POST",
    });
}

export async function patchAdminRunner(
    accessToken: string,
    runnerId: number | string,
    runner: PatchAdminRunnerApiRequest["payload"],
): Promise<ApiRequestResult<PatchAdminRunnerApiRequest>> {
    return performAuthenticatedApiRequest<PatchAdminRunnerApiRequest>(`/admin/runners/${runnerId}`, accessToken, runner, {
        method: "PATCH",
    });
}

export async function deleteAdminRunner(
    accessToken: string,
    runnerId: number | string,
): Promise<ApiRequestResult<DeleteAdminRunnerApiRequest>> {
    return performAuthenticatedApiRequest<DeleteAdminRunnerApiRequest>(`/admin/runners/${runnerId}`, accessToken, undefined, {
        method: "DELETE",
    });
}

export async function postAdminRunnerPassage(
    accessToken: string,
    runnerId: number | string,
    passage: PostAdminRunnerPassageApiRequest["payload"],
): Promise<ApiRequestResult<PostAdminRunnerPassageApiRequest>> {
    return performAuthenticatedApiRequest<PostAdminRunnerPassageApiRequest>(
        `/admin/runners/${runnerId}/passages`,
        accessToken,
        passage,
        { method: "POST" },
    );
}

export async function patchAdminRunnerPassage(
    accessToken: string,
    runnerId: number | string,
    passageId: number | string,
    passage: PatchAdminRunnerPassageApiRequest["payload"],
): Promise<ApiRequestResult<PatchAdminRunnerPassageApiRequest>> {
    return performAuthenticatedApiRequest<PatchAdminRunnerPassageApiRequest>(
        `/admin/runners/${runnerId}/passages/${passageId}`,
        accessToken,
        passage,
        { method: "PATCH" },
    );
}

export async function deleteAdminRunnerPassage(
    accessToken: string,
    runnerId: number | string,
    passageId: number | string,
): Promise<ApiRequestResult<DeleteAdminRunnerPassageApiRequest>> {
    return performAuthenticatedApiRequest<DeleteAdminRunnerPassageApiRequest>(
        `/admin/runners/${runnerId}/passages/${passageId}`,
        accessToken,
        undefined,
        { method: "DELETE" },
    );
}
