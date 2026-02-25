import React from "react";
import { userContext } from "../../contexts/UserContext";

export function useAccessToken(): string | null {
  return React.useContext(userContext).accessToken;
}
