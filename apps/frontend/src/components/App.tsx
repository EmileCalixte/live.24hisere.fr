/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { Helmet } from "react-helmet";
import { Route, Routes, useMatch, useNavigate } from "react-router-dom";
import type { PublicUser } from "@live24hisere/core/types";
import { APP_BASE_TITLE } from "../constants/app";
import { useGetCurrentUser } from "../hooks/api/requests/auth/useGetCurrentUser";
import { useLogout } from "../hooks/api/requests/auth/useLogout";
import { useGetAppData } from "../hooks/api/requests/public/appData/useGetAppData";
import { EVENT_API_REQUEST_ENDED, EVENT_API_REQUEST_STARTED } from "../utils/apiUtils";
import { verbose } from "../utils/utils";
import CircularLoader from "./ui/CircularLoader";
import Footer from "./ui/footer/Footer";
import Header from "./ui/header/Header";
import DisabledAppView from "./views/DisabledAppView";
import LoginView from "./views/LoginView";
import Public from "./views/public/Public";

const Admin = React.lazy(async () => await import("./views/admin/Admin"));

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

export const appContext = React.createContext<AppContext>({
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
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchLevel, setFetchLevel] = React.useState(0);
  const [fetchAppDataError, setFetchAppDataError] = React.useState<unknown>(null);
  const [lastUpdateTime, setLastUpdateTime] = React.useState(new Date());
  const [serverTimeOffset, setServerTimeOffset] = React.useState(0);
  const [isAppEnabled, setIsAppEnabled] = React.useState(false);
  const [disabledAppMessage, setDisabledAppMessage] = React.useState<string | null>(null);
  const [currentEditionId, setCurrentEditionId] = React.useState<number | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(localStorage.getItem("accessToken"));
  const [user, setUser] = React.useState<PublicUser | null | undefined>(undefined); // If null, user is not logged in. If undefined, user info was not fetched yet

  const getAppDataQuery = useGetAppData();
  const appData = getAppDataQuery.data;

  const getCurrentUserQuery = useGetCurrentUser(accessToken, forgetAccessToken);
  const lastFetchedCurrentUser = getCurrentUserQuery.data?.user;

  const logoutMutation = useLogout();

  const isLoginRoute = !!useMatch("/login");
  const isAdminRoute = !!useMatch("/admin/*");

  const incrementFetchLevel = React.useCallback(() => {
    setFetchLevel((level) => level + 1);
  }, []);

  const decrementFetchLevel = React.useCallback(() => {
    setFetchLevel((level) => Math.max(0, level - 1));
  }, []);

  function saveAccessToken(token: string): void {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
  }

  function forgetAccessToken(): void {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  }

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

  function logout(): void {
    if (!accessToken) {
      return;
    }

    logoutMutation.mutate(accessToken, {
      onSuccess: () => {
        forgetAccessToken();
        setUser(null);
        void navigate("/");
      },
    });
  }

  React.useEffect(() => {
    window.addEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
    window.addEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);

    return () => {
      window.removeEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
      window.removeEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);
    };
  }, [incrementFetchLevel, decrementFetchLevel]);

  React.useEffect(() => {
    if (lastFetchedCurrentUser) {
      setUser(lastFetchedCurrentUser);
    }
  }, [lastFetchedCurrentUser]);

  React.useEffect(() => {
    if (accessToken === null) {
      setUser(null);
    }
  }, [accessToken]);

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
                <Route
                  path="/admin/*"
                  element={
                    <React.Suspense fallback={<CircularLoader />}>
                      <Admin />
                    </React.Suspense>
                  }
                />
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
