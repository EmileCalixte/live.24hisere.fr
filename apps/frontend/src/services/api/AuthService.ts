import { type ApiRequestResult } from "../../types/api/ApiRequest";
import {
    type GetCurrentUserInfoApiRequest,
    type LoginApiRequest,
    type LogoutApiRequest,
} from "../../types/api/AuthApiRequests";
import {
    performApiRequest,
    performAuthenticatedApiRequest,
} from "./ApiService";

export async function getCurrentUserInfo(
    accessToken: string,
): Promise<ApiRequestResult<GetCurrentUserInfoApiRequest>> {
    return await performAuthenticatedApiRequest(
        "/auth/current-user-info",
        accessToken,
    );
}

export async function login(
    username: string,
    password: string,
): Promise<ApiRequestResult<LoginApiRequest>> {
    return await performApiRequest<LoginApiRequest>(
        "/auth/login",
        { username, password },
        { method: "POST" },
    );
}

export async function logout(
    accessToken: string,
): Promise<ApiRequestResult<LogoutApiRequest>> {
    return await performAuthenticatedApiRequest(
        "/auth/logout",
        accessToken,
        undefined,
        { method: "POST" },
    );
}
