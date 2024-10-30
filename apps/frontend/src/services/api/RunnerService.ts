import {
    type ApiRequestResult,
    type DeleteAdminRunnerPassageApiRequest,
    type DeleteRunnerAdminApiRequest,
    type GetRaceRunnersApiRequest,
    type GetRunnerAdminApiRequest,
    type GetRunnersAdminApiRequest,
    type GetRunnersApiRequest,
    type PatchRunnerAdminApiRequest,
    type PatchRunnerPassageAdminApiRequest,
    type PostRunnerAdminApiRequest,
    type PostRunnerPassageAdminApiRequest,
    type PostRunnersBulkAdminApiRequest,
} from "@live24hisere/core/types";
import {
    performApiRequest,
    performAuthenticatedApiRequest,
} from "./ApiService";

export async function getRunners(): Promise<
    ApiRequestResult<GetRunnersApiRequest>
> {
    return await performApiRequest<GetRunnersApiRequest>("/runners");
}

export async function getRaceRunners(
    raceId: number | string,
): Promise<ApiRequestResult<GetRaceRunnersApiRequest>> {
    return await performApiRequest<GetRaceRunnersApiRequest>(
        `/races/${raceId}/runners`,
    );
}

export async function getAdminRunners(
    accessToken: string,
): Promise<ApiRequestResult<GetRunnersAdminApiRequest>> {
    return await performAuthenticatedApiRequest<GetRunnersAdminApiRequest>(
        "/admin/runners",
        accessToken,
    );
}

export async function getAdminRunner(
    accessToken: string,
    runnerId: number | string,
): Promise<ApiRequestResult<GetRunnerAdminApiRequest>> {
    return await performAuthenticatedApiRequest<GetRunnerAdminApiRequest>(
        `/admin/runners/${runnerId}`,
        accessToken,
    );
}

export async function postAdminRunner(
    accessToken: string,
    runner: PostRunnerAdminApiRequest["payload"],
): Promise<ApiRequestResult<PostRunnerAdminApiRequest>> {
    return await performAuthenticatedApiRequest<PostRunnerAdminApiRequest>(
        "/admin/runners",
        accessToken,
        runner,
        {
            method: "POST",
        },
    );
}

export async function postAdminRunnersBulk(
    accessToken: string,
    runners: PostRunnersBulkAdminApiRequest["payload"],
): Promise<ApiRequestResult<PostRunnersBulkAdminApiRequest>> {
    return await performAuthenticatedApiRequest<PostRunnersBulkAdminApiRequest>(
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
): Promise<ApiRequestResult<PatchRunnerAdminApiRequest>> {
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
    runnerId: number | string,
): Promise<ApiRequestResult<DeleteRunnerAdminApiRequest>> {
    return await performAuthenticatedApiRequest<DeleteRunnerAdminApiRequest>(
        `/admin/runners/${runnerId}`,
        accessToken,
        undefined,
        {
            method: "DELETE",
        },
    );
}

export async function postAdminRunnerPassage(
    accessToken: string,
    runnerId: number | string,
    passage: PostRunnerPassageAdminApiRequest["payload"],
): Promise<ApiRequestResult<PostRunnerPassageAdminApiRequest>> {
    return await performAuthenticatedApiRequest<PostRunnerPassageAdminApiRequest>(
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
    passage: PatchRunnerPassageAdminApiRequest["payload"],
): Promise<ApiRequestResult<PatchRunnerPassageAdminApiRequest>> {
    return await performAuthenticatedApiRequest<PatchRunnerPassageAdminApiRequest>(
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
    return await performAuthenticatedApiRequest<DeleteAdminRunnerPassageApiRequest>(
        `/admin/runners/${runnerId}/passages/${passageId}`,
        accessToken,
        undefined,
        { method: "DELETE" },
    );
}
