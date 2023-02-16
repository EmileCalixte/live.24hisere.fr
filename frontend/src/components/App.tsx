import React, {createContext, useCallback, useEffect, useState} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {User} from "../types/User";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Ranking from "./pages/ranking/Ranking";
import RunnerDetails from "./pages/runner-details/RunnerDetails";
import ApiUtil, {EVENT_API_REQUEST_ENDED, EVENT_API_REQUEST_STARTED} from "../util/ApiUtil";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";
import Util from "../util/Util";
import ToastUtil from "../util/ToastUtil";

type AppDataContext = {
    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: Date;

    /**
     * Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
     */
    serverTimeOffset: number;
}

type HeaderFetchLoaderContext = {
    /**
     * A value incremented when a request is in progress, decremented when a request is completed.
     * The header loader should be displayed if this value is > 0.
     */
    fetchLevel: number;

    incrementFetchLevel: () => any;
    decrementFetchLevel: () => any;
}

type UserContext = {
    /**
     * The access token used for authenticated API requests
     */
    accessToken: string | null;

    saveAccessToken: (accessToken: string) => any;

    /**
     * The user logged in. If undefined, user info was not fetched yet.
     */
    user: User | null | undefined;

    setUser: (user: User | null | undefined) => any;

    logout: () => any;
}

export const appDataContext = createContext<AppDataContext>({
    lastUpdateTime: new Date(),
    serverTimeOffset: 0,
});

export const headerFetchLoaderContext = createContext<HeaderFetchLoaderContext>({
    fetchLevel: 0,
    incrementFetchLevel: () => {},
    decrementFetchLevel: () => {},
});

export const userContext = createContext<UserContext>({
    accessToken: null,
    saveAccessToken: () => {},
    user: undefined,
    setUser: () => {},
    logout: () => {},
});

const FETCH_APP_DATA_INTERVAL_TIME = 60 * 1000;

const App: React.FunctionComponent = () => {
    const [fetchLevel, setFetchLevel] = useState(0);
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
    const [serverTimeOffset, setServerTimeOffset] = useState(0);
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
    const [user, setUser] = useState<User | null | undefined>(undefined); // If null, user is not logged in. If undefined, user info was not fetched yet
    const [redirect, setRedirect] = useState<string | null>(null); // Used to redirect the user to a specified location, for example when user logs out

    const incrementFetchLevel = useCallback(() => {
        setFetchLevel(level => level + 1);
    }, []);

    const decrementFetchLevel = useCallback(() => {
        setFetchLevel(level => Math.max(0, level - 1));
    }, []);

    const saveAccessToken = useCallback((token: string) => {
        localStorage.setItem("accessToken", token);
        setAccessToken(token);
    }, []);

    const forgetAccessToken = useCallback(() => {
        localStorage.removeItem("accessToken");
        setAccessToken(null);
    }, []);

    const fetchAppData = useCallback(async () => {
        const response = await ApiUtil.performAPIRequest("/app-data");
        const responseJson = await response.json();

        setLastUpdateTime(new Date(responseJson.lastUpdateTime));

        const serverTime = new Date(responseJson.currentTime);
        const clientTime = new Date();

        const timeOffsetMs = serverTime.getTime() - clientTime.getTime();

        setServerTimeOffset(Math.round(timeOffsetMs / 1000));
    }, []);

    const fetchUserInfo = useCallback(async () => {
        Util.verbose('Fetching user info');

        const response = await ApiUtil.performAuthenticatedAPIRequest("/auth/current-user-info", accessToken);

        if (!response.ok) {
            forgetAccessToken();
            setUser(null);
            ToastUtil.getToastr().error("Vous avez été déconecté");
        }

        const responseJson = await response.json();

        Util.verbose('User info', responseJson);

        setUser(responseJson.user);
    }, [accessToken, forgetAccessToken]);

    const logout = useCallback(() => {
        ApiUtil.performAuthenticatedAPIRequest('/auth/logout', accessToken, {
            method: 'POST',
        });

        forgetAccessToken();

        setUser(null);
        setRedirect("/");

        ToastUtil.getToastr().success('Vous avez été déconnecté');
    }, [accessToken, forgetAccessToken]);

    useEffect(() => {
        window.addEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
        window.addEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);

        return (() => {
            window.removeEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
            window.removeEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);
        });
    }, [incrementFetchLevel, decrementFetchLevel]);

    useEffect(() => {
        fetchAppData();

        const interval = setInterval(fetchAppData, FETCH_APP_DATA_INTERVAL_TIME);

        return (() => {
            clearInterval(interval);
        })
    }, [fetchAppData]);

    useEffect(() => {
        if (!accessToken) {
            setUser(null);
            return;
        }

        fetchUserInfo();
    }, [accessToken, fetchUserInfo]);

    if (redirect) {
        setRedirect(null);

        return (
            <BrowserRouter>
                <Navigate to={redirect} />
            </BrowserRouter>
        );
    }

    return (
        <BrowserRouter>
            <div id="app">
                <appDataContext.Provider value={{
                    lastUpdateTime,
                    serverTimeOffset,
                }}>
                    <headerFetchLoaderContext.Provider value={{
                        fetchLevel,
                        incrementFetchLevel,
                        decrementFetchLevel,
                    }}>
                        <userContext.Provider value={{
                            accessToken,
                            saveAccessToken,
                            user,
                            setUser,
                            logout,
                        }}>
                            <div id="app-content-wrapper">
                                <Header />
                                <div id="app-content">
                                    <div id="page-content" className="container-fluid">
                                        <Routes>
                                            <Route path="/ranking" element={<Ranking />} />
                                            <Route path="/runner-details" element={<RunnerDetails />} />
                                            <Route path="/runner-details/:runnerId" element={<RunnerDetails />} />

                                            <Route path="/login" element={<Login />} />

                                            <Route path="/admin/*" element={<Admin />} />

                                            {/* Redirect any unresolved route to /ranking */}
                                            <Route path="*" element={<Navigate to="/ranking" replace />} />
                                        </Routes>
                                    </div>
                                </div>
                            </div>
                            <Footer />
                        </userContext.Provider>
                    </headerFetchLoaderContext.Provider>
                </appDataContext.Provider>
            </div>
        </BrowserRouter>
    );
}

export default App;
