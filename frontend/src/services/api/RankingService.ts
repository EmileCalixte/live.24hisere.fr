import { type ApiRequestResult } from "../../types/api/ApiRequest";
import { type GetRankingApiRequest } from "../../types/api/RankingApiRequests";
import { type DateISOString } from "../../types/Utils";
import { performApiRequest } from "./ApiService";

export async function getRanking(raceId: number | string, atTime?: DateISOString): Promise<ApiRequestResult<GetRankingApiRequest>> {
    let url = `/ranking/${raceId}`;

    if (atTime !== undefined) {
        url += `?at=${atTime}`;
    }

    return performApiRequest<GetRankingApiRequest>(url);
}
