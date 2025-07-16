import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes, useMatch, useNavigate } from "react-router-dom";
import type { CustomRunnerCategory, PublicUser } from "@live24hisere/core/types";
import { APP_BASE_TITLE } from "../constants/app";
import { appContext, type AppContext } from "../contexts/AppContext";
import { useGetCurrentUser } from "../hooks/api/requests/auth/useGetCurrentUser";
import { useLogout } from "../hooks/api/requests/auth/useLogout";
import { useGetAppData } from "../hooks/api/requests/public/appData/useGetAppData";
import { useTheme } from "../hooks/useTheme";
import { EVENT_API_REQUEST_ENDED, EVENT_API_REQUEST_STARTED } from "../utils/apiUtils";
import { verbose } from "../utils/utils";
import CircularLoader from "./ui/CircularLoader";
import Footer from "./ui/footer/Footer";
import Header from "./ui/header/Header";
import DisabledAppView from "./views/DisabledAppView";
import LoginView from "./views/LoginView";

const Admin = React.lazy(async () => await import("./views/admin/Admin"));
const About = React.lazy(async () => await import("./views/AboutView"));
const RacesView = React.lazy(async () => await import("./views/RacesView"));
const RunnerDetailsView = React.lazy(async () => await import("./views/RunnerDetailsView"));
const SearchRunnerView = React.lazy(async () => await import("./views/SearchRunnerView"));

export default function App(): React.ReactElement {
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchLevel, setFetchLevel] = React.useState(0);
  const [fetchAppDataError, setFetchAppDataError] = React.useState<unknown>(null);
  const [lastUpdateTime, setLastUpdateTime] = React.useState(new Date());
  const [serverTimeOffset, setServerTimeOffset] = React.useState(0);
  const [isAppEnabled, setIsAppEnabled] = React.useState(false);
  const [disabledAppMessage, setDisabledAppMessage] = React.useState<string | null>(null);
  const [currentEditionId, setCurrentEditionId] = React.useState<number | null>(null);
  const [customRunnerCategories, setCustomRunnerCategories] = React.useState<CustomRunnerCategory[]>([]);
  const [accessToken, setAccessToken] = React.useState<string | null>(localStorage.getItem("accessToken"));
  const [user, setUser] = React.useState<PublicUser | null | undefined>(undefined); // If null, user is not logged in. If undefined, user info was not fetched yet

  const getAppDataQuery = useGetAppData();
  const appData = getAppDataQuery.data;

  const forgetAccessToken = React.useCallback(() => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  }, []);

  const getCurrentUserQuery = useGetCurrentUser(accessToken, forgetAccessToken);
  const lastFetchedCurrentUser = getCurrentUserQuery.data?.user;

  const logoutMutation = useLogout();

  const isLoginRoute = !!useMatch("/login");
  const isAdminRoute = !!useMatch("/admin/*");
  const isAboutRoute = !!useMatch("/about");

  const isBypassDisabledAppRoute = isLoginRoute || isAdminRoute || isAboutRoute;

  const incrementFetchLevel = React.useCallback(() => {
    setFetchLevel((level) => level + 1);
  }, []);

  const decrementFetchLevel = React.useCallback(() => {
    setFetchLevel((level) => Math.max(0, level - 1));
  }, []);

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
        setUser(null);
        void navigate("/");
      },
    });
  }, [accessToken, forgetAccessToken, logoutMutation, navigate]);

  React.useEffect(() => {
    if (!appData) {
      return;
    }

    verbose("App data", appData);

    setIsAppEnabled(appData.isAppEnabled);
    setDisabledAppMessage(appData.disabledAppMessage);

    setCurrentEditionId(appData.currentEditionId);

    setCustomRunnerCategories(appData.customRunnerCategories);

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
      customRunnerCategories,
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
    theme: {
      theme,
      setTheme,
    },
  };

  const showDisabledAppMessage = !user && !isAppEnabled && !isBypassDisabledAppRoute;

  return (
    <div id="app" className="flex min-h-[100vh] flex-col">
      <Helmet>
        <title>{APP_BASE_TITLE}</title>
      </Helmet>
      <appContext.Provider value={appContextValues}>
        <div id="app-content-wrapper" className="flex-1">
          <Header />
          <main id="page-wrapper" className="mt-3 pb-5">
            {isLoading ? (
              <CircularLoader />
            ) : showDisabledAppMessage ? (
              <DisabledAppView />
            ) : (
              <React.Suspense fallback={<CircularLoader />}>
                <Routes>
                  <Route path="/login" element={<LoginView />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/races" element={<RacesView />} />
                  <Route path="/runner-details" element={<RunnerDetailsView />} />
                  <Route path="/runner-details/search" element={<SearchRunnerView />} />
                  <Route path="/runner-details/:runnerId" element={<RunnerDetailsView />} />

                  {/* Redirect any unresolved route to /races */}
                  <Route path="*" element={<Navigate to="/races" replace />} />
                </Routes>
              </React.Suspense>
            )}
          </main>
        </div>
        <Footer />
      </appContext.Provider>
    </div>
  );
}
