import { useAccessToken } from "./useAccessToken";

export function useRequiredAccessToken(): string {
  const accessToken = useAccessToken();

  if (accessToken === null) {
    throw new Error("Access token is not defined in app context");
  }

  return accessToken;
}
