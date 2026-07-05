/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { useNavigate } from "react-router-dom";
import type { PublicUser } from "@live24hisere/core/types";
import { useGetCurrentUser } from "../hooks/api/requests/auth/useGetCurrentUser";
import { useLogout } from "../hooks/api/requests/auth/useLogout";

export interface UserContext {
  accessToken: string | null;
  saveAccessToken: (accessToken: string) => void;
  user: PublicUser | null | undefined;
  setUser: (user: PublicUser | null | undefined) => void;
  logout: () => void;
}

export const userContext = React.createContext<UserContext>({
  accessToken: null,
  saveAccessToken: () => {},
  user: undefined,
  setUser: () => {},
  logout: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = React.useState<string | null>(() => localStorage.getItem("accessToken"));
  // undefined = user not yet fetched, null = known to be not logged in
  const [user, setUser] = React.useState<PublicUser | null | undefined>(() =>
    accessToken === null ? null : undefined,
  );

  const forgetAccessToken = React.useCallback(() => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  }, []);

  const getCurrentUserQuery = useGetCurrentUser(accessToken, forgetAccessToken);
  const lastFetchedCurrentUser = getCurrentUserQuery.data?.user;

  const logoutMutation = useLogout();

  const saveAccessToken = React.useCallback((token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  }, []);

  const logout = React.useCallback(() => {
    if (!accessToken) {
      return;
    }

    logoutMutation.mutate(accessToken, {
      onSuccess: () => {
        forgetAccessToken();
        void navigate("/");
      },
    });
  }, [accessToken, forgetAccessToken, logoutMutation, navigate]);

  React.useEffect(() => {
    if (lastFetchedCurrentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Legitimate sync of react-query cache (external system) into overridable user state
      setUser(lastFetchedCurrentUser);
    }
  }, [lastFetchedCurrentUser]);

  const value = React.useMemo<UserContext>(
    () => ({ accessToken, saveAccessToken, user, setUser, logout }),
    [accessToken, saveAccessToken, user, logout],
  );

  return React.createElement(userContext.Provider, { value }, children);
}
