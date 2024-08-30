import { type AdminPassageWithRunnerId } from "@live24hisere/types";
import { type ApiRequest } from "./ApiRequest";

export interface GetAdminPassagesApiRequest extends ApiRequest {
    payload: never;

    response: {
        passages: AdminPassageWithRunnerId[];
    };
}
