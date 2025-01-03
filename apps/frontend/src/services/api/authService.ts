import type {
  ApiRequestResultLegacy,
  GetCurrentUserInfoApiRequest,
  LoginApiRequest,
  LogoutApiRequest,
} from "@live24hisere/core/types";
import { performApiRequestLegacy, performAuthenticatedApiRequestLegacy } from "./apiService";

export async function getCurrentUserInfo(
  accessToken: string,
): Promise<ApiRequestResultLegacy<GetCurrentUserInfoApiRequest>> {
  return await performAuthenticatedApiRequestLegacy("/auth/current-user-info", accessToken);
}

export async function login(username: string, password: string): Promise<ApiRequestResultLegacy<LoginApiRequest>> {
  return await performApiRequestLegacy<LoginApiRequest>("/auth/login", { username, password }, { method: "POST" });
}

export async function logout(accessToken: string): Promise<ApiRequestResultLegacy<LogoutApiRequest>> {
  return await performAuthenticatedApiRequestLegacy("/auth/logout", accessToken, undefined, { method: "POST" });
}
