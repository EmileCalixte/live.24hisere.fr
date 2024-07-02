import { type AdminPassageWithRunnerId } from "../Passage";
import { type ApiRequest } from "./ApiRequest";

export interface GetAdminPassagesApiRequest extends ApiRequest {
    payload: never;

    response: {
        passages: AdminPassageWithRunnerId[];
    };
}
