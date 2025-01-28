import type {
  ApiRequestResultLegacy,
  ApiResponse,
  GetCurrentUserInfoApiRequest,
  LoginApiRequest,
  LogoutApiRequest,
} from "@live24hisere/core/types";
import { performApiRequest, performAuthenticatedApiRequest, performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getCurrentUserInfo(
  accessToken: string,
): Promise<ApiRequestResultLegacy<GetCurrentUserInfoApiRequest>> {
  return await performAuthenticatedApiRequestLegacy("/auth/current-user-info", accessToken);
}

export async function login(username: string, password: string): Promise<ApiResponse<LoginApiRequest>> {
  return await performApiRequest<LoginApiRequest>("/auth/login", { username, password }, { method: "POST" });
}

export async function logout(accessToken: string): Promise<ApiResponse<LogoutApiRequest>> {
  return await performAuthenticatedApiRequest<LogoutApiRequest>("/auth/logout", accessToken, undefined, {
    method: "POST",
  });
}
