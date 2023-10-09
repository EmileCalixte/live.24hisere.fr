import { type OldRanking } from "../Ranking";
import { type ApiRequest } from "./ApiRequest";

export interface GetRankingApiRequest extends ApiRequest {
    payload: never;

    response: {
        ranking: OldRanking;
    };
}
