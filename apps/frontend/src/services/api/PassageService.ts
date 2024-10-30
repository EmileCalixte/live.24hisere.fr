import {
    type ApiRequestResult,
    type GetAllPassagesAdminApiRequest,
} from "@live24hisere/core/types";
import { performAuthenticatedApiRequest } from "./ApiService";

export async function getAdminPassages(
    accessToken: string,
): Promise<ApiRequestResult<GetAllPassagesAdminApiRequest>> {
    return await performAuthenticatedApiRequest<GetAllPassagesAdminApiRequest>(
        "/admin/passages",
        accessToken,
    );
}
