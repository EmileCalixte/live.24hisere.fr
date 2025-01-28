import React from "react";
import { appContext } from "../../components/App";

export function useAccessToken(): string | null {
  return React.useContext(appContext).user.accessToken;
}
