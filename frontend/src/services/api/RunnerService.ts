import { type ApiRequestResult } from "../../types/api/ApiRequest";
import { type GetRunnerApiRequest, type GetRunnersApiRequest } from "../../types/api/RunnerApiRequests";
import { performApiRequest } from "./ApiService";

export async function getRunners(): Promise<ApiRequestResult<GetRunnersApiRequest>> {
    return performApiRequest<GetRunnersApiRequest>("/runners");
}

export async function getRunner(runnerId: number | string): Promise<ApiRequestResult<GetRunnerApiRequest>> {
    return performApiRequest<GetRunnerApiRequest>(`/runners/${runnerId}`);
}
