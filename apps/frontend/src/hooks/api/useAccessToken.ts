import React from "react";
import { appContext } from "../../contexts/AppContext";

export function useAccessToken(): string | null {
  return React.useContext(appContext).user.accessToken;
}
