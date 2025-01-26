/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Navigate, Route, Routes, useMatch } from "react-router-dom";
import type { PublicUser } from "@live24hisere/core/types";
import { APP_BASE_TITLE } from "../constants/app";
import { useGetAppData } from "../hooks/api/requests/public/appData/useGetAppData";
import { getCurrentUserInfo, logout as performLogoutRequest } from "../services/api/authService";
import ToastService from "../services/ToastService";
import { EVENT_API_REQUEST_ENDED, EVENT_API_REQUEST_STARTED, isApiRequestResultOk } from "../utils/apiUtils";
import { verbose } from "../utils/utils";
import CircularLoader from "./ui/CircularLoader";
import Footer from "./ui/footer/Footer";
import Header from "./ui/header/Header";
import Admin from "./views/admin/Admin";
import DisabledAppView from "./views/DisabledAppView";
import LoginView from "./views/LoginView";
import Public from "./views/public/Public";

interface AppContext {
  appData: {
    /**
     * The error triggered if last app data request failed
     */
    fetchError: unknown;

    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: Date;

    /**
     * Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
     */
    serverTimeOffset: number;

    /**
     * Whether the app is accessible or not
     */
    isAppEnabled: boolean;
    setIsAppEnabled: (isAppEnabled: boolean) => void;

    /**
     * The ID of the edition to be auto-selected if no edition is selected
     */
    currentEditionId: number | null;

    /**
     * If the app is disabled, the message to be displayed
     */
    disabledAppMessage: string | null;
  };

  headerFetchLoader: {
    /**
     * A value incremented when a request is in progress, decremented when a request is completed.
     * The header loader should be displayed if this value is > 0.
     */
    fetchLevel: number;

    incrementFetchLevel: () => void;
    decrementFetchLevel: () => void;
  };

  user: {
    /**
     * The access token used for authenticated API requests
     */
    accessToken: string | null;

    saveAccessToken: (accessToken: string) => void;

    /**
     * The user logged in. If undefined, user info was not fetched yet.
     */
    user: PublicUser | null | undefined;

    setUser: (user: PublicUser | null | undefined) => void;

    logout: () => void;
  };
}

export const appContext = createContext<AppContext>({
  appData: {
    fetchError: null,
    lastUpdateTime: new Date(),
    serverTimeOffset: 0,
    isAppEnabled: false,
    setIsAppEnabled: () => {},
    currentEditionId: null,
    disabledAppMessage: null,
  },
  headerFetchLoader: {
    fetchLevel: 0,
    incrementFetchLevel: () => {},
    decrementFetchLevel: () => {},
  },
  user: {
    accessToken: null,
    saveAccessToken: () => {},
    user: undefined,
    setUser: () => {},
    logout: () => {},
  },
});

export default function App(): React.ReactElement {
  const getAppDataQuery = useGetAppData();
  const appData = getAppDataQuery.data;

  const [isLoading, setIsLoading] = useState(true);
  const [fetchLevel, setFetchLevel] = useState(0);
  const [fetchAppDataError, setFetchAppDataError] = useState<unknown>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [serverTimeOffset, setServerTimeOffset] = useState(0);
  const [isAppEnabled, setIsAppEnabled] = useState(false);
  const [disabledAppMessage, setDisabledAppMessage] = useState<string | null>(null);
  const [currentEditionId, setCurrentEditionId] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined); // If null, user is not logged in. If undefined, user info was not fetched yet
  const [redirect, setRedirect] = useState<string | null>(null); // Used to redirect the user to a specified location, for example when user logs out

  const isLoginRoute = !!useMatch("/login");
  const isAdminRoute = !!useMatch("/admin/*");

  const incrementFetchLevel = useCallback(() => {
    setFetchLevel((level) => level + 1);
  }, []);

  const decrementFetchLevel = useCallback(() => {
    setFetchLevel((level) => Math.max(0, level - 1));
  }, []);

  const saveAccessToken = useCallback((token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  }, []);

  const forgetAccessToken = useCallback(() => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  }, []);

  React.useEffect(() => {
    if (!appData) {
      return;
    }

    verbose("App data", appData);

    setIsAppEnabled(appData.isAppEnabled);
    setDisabledAppMessage(appData.disabledAppMessage);

    setCurrentEditionId(appData.currentEditionId);

    setLastUpdateTime(new Date(appData.lastUpdateTime ?? 0));

    const serverTime = new Date(appData.currentTime);
    const clientTime = new Date();

    const timeOffsetMs = serverTime.getTime() - clientTime.getTime();

    setServerTimeOffset(Math.round(timeOffsetMs / 1000));

    setIsLoading(false);
  }, [appData]);

  React.useEffect(() => {
    setFetchAppDataError(getAppDataQuery.error);
  }, [getAppDataQuery.error]);

  const fetchUserInfo = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    verbose("Fetching user info");

    const result = await getCurrentUserInfo(accessToken);

    if (!isApiRequestResultOk(result)) {
      forgetAccessToken();
      setUser(null);
      ToastService.getToastr().error("Vous avez été déconnecté");
      return;
    }

    verbose("User info", result.json);

    setUser(result.json.user);
  }, [accessToken, forgetAccessToken]);

  const logout = useCallback(() => {
    if (accessToken) {
      void performLogoutRequest(accessToken);
    }

    forgetAccessToken();

    setUser(null);
    setRedirect("/");

    ToastService.getToastr().success("Vous avez été déconnecté");
  }, [accessToken, forgetAccessToken]);

  useEffect(() => {
    window.addEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
    window.addEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);

    return () => {
      window.removeEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
      window.removeEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);
    };
  }, [incrementFetchLevel, decrementFetchLevel]);

  useEffect(() => {
    if (accessToken === null) {
      setUser(null);
      return;
    }

    void fetchUserInfo();
  }, [accessToken, fetchUserInfo]);

  if (redirect !== null) {
    setRedirect(null);

    return (
      <BrowserRouter>
        <Navigate to={redirect} />
      </BrowserRouter>
    );
  }

  const appContextValues: AppContext = {
    appData: {
      fetchError: fetchAppDataError,
      lastUpdateTime,
      serverTimeOffset,
      isAppEnabled,
      setIsAppEnabled,
      currentEditionId,
      disabledAppMessage,
    },
    headerFetchLoader: {
      fetchLevel,
      incrementFetchLevel,
      decrementFetchLevel,
    },
    user: {
      accessToken,
      saveAccessToken,
      user,
      setUser,
      logout,
    },
  };

  const showDisabledAppMessage = !user && !isAppEnabled && !isLoginRoute && !isAdminRoute;

  return (
    <div id="app">
      <Helmet>
        <title>{APP_BASE_TITLE}</title>
      </Helmet>
      <appContext.Provider value={appContextValues}>
        <div id="app-content-wrapper">
          <Header />
          <main id="page-content" className="container-fluid">
            {isLoading ? (
              <CircularLoader />
            ) : showDisabledAppMessage ? (
              <DisabledAppView />
            ) : (
              <Routes>
                <Route path="/login" element={<LoginView />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="*" element={<Public />} />
              </Routes>
            )}
          </main>
        </div>
        <Footer />
      </appContext.Provider>
    </div>
  );
}
