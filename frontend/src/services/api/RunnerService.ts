import { type ApiRequestResult } from "../../types/api/ApiRequest";
import {
    type GetAdminRunnersApiRequest,
    type GetRunnerApiRequest,
    type GetRunnersApiRequest,
} from "../../types/api/RunnerApiRequests";
import { performApiRequest, performAuthenticatedApiRequest } from "./ApiService";

export async function getRunners(): Promise<ApiRequestResult<GetRunnersApiRequest>> {
    return performApiRequest<GetRunnersApiRequest>("/runners");
}

export async function getRunner(runnerId: number | string): Promise<ApiRequestResult<GetRunnerApiRequest>> {
    return performApiRequest<GetRunnerApiRequest>(`/runners/${runnerId}`);
}

export async function getAdminRunners(accessToken: string): Promise<ApiRequestResult<GetAdminRunnersApiRequest>> {
    return performAuthenticatedApiRequest<GetAdminRunnersApiRequest>("/admin/runners", accessToken);
}
