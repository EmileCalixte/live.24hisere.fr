import React from "react";
import { appContext } from "../../components/App";

export function useRequiredAccessToken(): string {
  const { accessToken } = React.useContext(appContext).user;

  if (accessToken === null) {
    throw new Error("Access token is not defined in app context");
  }

  return accessToken;
}
