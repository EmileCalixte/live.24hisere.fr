import {
    type ApiRequestResult,
    type DeleteRaceAdminApiRequest,
    type GetRaceAdminApiRequest,
    type GetRaceApiRequest,
    type GetRacesAdminApiRequest,
    type GetRacesApiRequest,
    type PatchRaceAdminApiRequest,
    type PostRaceAdminApiRequest,
    type PutRaceOrderAdminApiRequest,
} from "@live24hisere/core/types";
import {
    performApiRequest,
    performAuthenticatedApiRequest,
} from "./ApiService";

export async function getRaces(): Promise<
    ApiRequestResult<GetRacesApiRequest>
> {
    return await performApiRequest<GetRacesApiRequest>("/races");
}

export async function getRace(
    raceId: number | string,
): Promise<ApiRequestResult<GetRaceApiRequest>> {
    return await performApiRequest<GetRaceApiRequest>(`/races/${raceId}`);
}

export async function getAdminRaces(
    accessToken: string,
): Promise<ApiRequestResult<GetRacesAdminApiRequest>> {
    return await performAuthenticatedApiRequest<GetRacesAdminApiRequest>(
        "/admin/races",
        accessToken,
    );
}

export async function getAdminRace(
    accessToken: string,
    raceId: number | string,
): Promise<ApiRequestResult<GetRaceAdminApiRequest>> {
    return await performAuthenticatedApiRequest<GetRaceAdminApiRequest>(
        `/admin/races/${raceId}`,
        accessToken,
    );
}

export async function postAdminRace(
    accessToken: string,
    race: PostRaceAdminApiRequest["payload"],
): Promise<ApiRequestResult<PostRaceAdminApiRequest>> {
    return await performAuthenticatedApiRequest<PostRaceAdminApiRequest>(
        "/admin/races",
        accessToken,
        race,
        {
            method: "POST",
        },
    );
}

export async function patchAdminRace(
    accessToken: string,
    raceId: number | string,
    race: PatchRaceAdminApiRequest["payload"],
): Promise<ApiRequestResult<PatchRaceAdminApiRequest>> {
    return await performAuthenticatedApiRequest<PatchRaceAdminApiRequest>(
        `/admin/races/${raceId}`,
        accessToken,
        race,
        { method: "PATCH" },
    );
}

export async function deleteAdminRace(
    accessToken: string,
    raceId: number | string,
): Promise<ApiRequestResult<DeleteRaceAdminApiRequest>> {
    return await performAuthenticatedApiRequest<DeleteRaceAdminApiRequest>(
        `/admin/races/${raceId}`,
        accessToken,
        undefined,
        { method: "DELETE" },
    );
}

export async function putAdminRaceOrder(
    accessToken: string,
    raceOrder: PutRaceOrderAdminApiRequest["payload"],
): Promise<ApiRequestResult<PutRaceOrderAdminApiRequest>> {
    return await performAuthenticatedApiRequest<PutRaceOrderAdminApiRequest>(
        "/admin/races-order",
        accessToken,
        raceOrder,
        {
            method: "PUT",
        },
    );
}
