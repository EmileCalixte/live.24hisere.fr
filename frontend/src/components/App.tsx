import React, { createContext, useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { getRankingMap, getRunnersFromRankingMap } from "../helpers/rankingHelper";
import { getAppData } from "../services/api/AppDataService";
import { getCurrentUserInfo, logout as performLogoutRequest } from "../services/api/AuthService";
import { type PassageWithRunnerId } from "../types/Passage";
import { type Race } from "../types/Race";
import { type RankingMap, type RankingRunner } from "../types/Ranking";
import { type RunnerProcessedData, type RunnerWithProcessedHours, type RunnerWithProcessedPassages } from "../types/Runner";
import { type User } from "../types/User";
import { getProcessedHoursFromPassages, getProcessedPassagesFromPassages, getRunnerProcessedDataFromPassages } from "../util/passageUtils";
import { getRunnersWithPassagesFromRunnersAndPassages } from "../util/runnerUtils";
import Header from "./ui/header/Header";
import Footer from "./ui/footer/Footer";
import RankingView from "./views/RankingView";
import RunnerDetailsView from "./views/RunnerDetailsView";
import {
    EVENT_API_REQUEST_ENDED,
    EVENT_API_REQUEST_STARTED,
    isApiRequestResultOk,
} from "../util/apiUtils";
import LoginView from "./views/LoginView";
import Admin from "./views/admin/Admin";
import { objectArrayToMap, verbose } from "../util/utils";
import ToastUtil from "../util/ToastUtil";

type AppDataContextRunner = RunnerWithProcessedPassages & RunnerWithProcessedHours & RunnerProcessedData;

interface AppDataContext {
    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: Date;

    /**
     * Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
     */
    serverTimeOffset: number;

    /**
     * The race list, false if not fetched yet
     */
    races: Race[] | false;

    /**
     * The list of runners with processed data, false if not fetched/processed yet
     */
    runners: Array<RankingRunner<AppDataContextRunner>> | false;

    /**
     * The list of all passages of all runners
     */
    passages: PassageWithRunnerId[] | false;

    /**
     * The rankings, false if not fetched/processed yet
     */
    rankings: RankingMap<AppDataContextRunner> | false;
}

interface HeaderFetchLoaderContext {
    /**
     * A value incremented when a request is in progress, decremented when a request is completed.
     * The header loader should be displayed if this value is > 0.
     */
    fetchLevel: number;

    incrementFetchLevel: () => any;
    decrementFetchLevel: () => any;
}

interface UserContext {
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
    races: false,
    runners: false,
    passages: false,
    rankings: false,
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

// Fetch app data every 20 seconds
const FETCH_APP_DATA_INTERVAL_TIME = 20 * 1000;

export default function App(): React.ReactElement {
    const [fetchLevel, setFetchLevel] = useState(0);
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
    const [serverTimeOffset, setServerTimeOffset] = useState(0);
    const [races, setRaces] = useState<Race[] | false>(false);
    const [runners, setRunners] = useState<Array<RankingRunner<AppDataContextRunner>> | false>(false);
    const [passages, setPassages] = useState<PassageWithRunnerId[] | false>(false);
    const [rankings, setRankings] = useState<RankingMap<AppDataContextRunner> | false>(false);
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
        verbose("Fetching app data");

        const result = await getAppData();

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Impossible de récupérer les informations de l'application");
            return;
        }

        verbose("App data", result.json);

        setLastUpdateTime(new Date(result.json.lastUpdateTime));

        const serverTime = new Date(result.json.currentTime);
        const clientTime = new Date();

        const timeOffsetMs = serverTime.getTime() - clientTime.getTime();

        setServerTimeOffset(Math.round(timeOffsetMs / 1000));

        const raceMap = objectArrayToMap(result.json.races, "id");

        const processedRunners = getRunnersWithPassagesFromRunnersAndPassages(
            result.json.runners,
            result.json.passages,
        )
            .filter(runner => raceMap.has(runner.raceId))
            .map(runner => ({
                ...runner,
                ...getRunnerProcessedDataFromPassages(
                    raceMap.get(runner.raceId) as Race,
                    runner.passages,
                ),
                passages: getProcessedPassagesFromPassages(
                    runner.passages,
                    raceMap.get(runner.raceId) as Race,
                ),
            }))
            .map(runner => ({
                ...runner,
                hours: getProcessedHoursFromPassages(
                    runner.passages,
                    raceMap.get(runner.raceId) as Race,
                ),
            }));

        const rankingMap = getRankingMap(
            result.json.races,
            processedRunners,
        );

        verbose("Rankings", rankingMap);

        setRaces(result.json.races);
        setRunners(getRunnersFromRankingMap(rankingMap));
        setPassages(result.json.passages);
        setRankings(rankingMap);
    }, []);

    const fetchUserInfo = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        verbose("Fetching user info");

        const result = await getCurrentUserInfo(accessToken);

        if (!isApiRequestResultOk(result)) {
            forgetAccessToken();
            setUser(null);
            ToastUtil.getToastr().error("Vous avez été déconecté");
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

        ToastUtil.getToastr().success("Vous avez été déconnecté");
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
        void fetchAppData();

        const interval = setInterval(() => { void fetchAppData(); }, FETCH_APP_DATA_INTERVAL_TIME);

        return () => {
            clearInterval(interval);
        };
    }, [fetchAppData]);

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

    return (
        <BrowserRouter>
            <div id="app">
                <Helmet>
                    <title>Suivi live - Les 24 Heures de l'Isère</title>
                </Helmet>
                <appDataContext.Provider value={{
                    lastUpdateTime,
                    serverTimeOffset,
                    races,
                    runners,
                    passages,
                    rankings,
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
                                <main id="page-content" className="container-fluid">
                                    <Routes>
                                        <Route path="/ranking" element={<RankingView />} />
                                        <Route path="/runner-details" element={<RunnerDetailsView />} />
                                        <Route path="/runner-details/:runnerId" element={<RunnerDetailsView />} />

                                        <Route path="/login" element={<LoginView />} />

                                        <Route path="/admin/*" element={<Admin />} />

                                        {/* Redirect any unresolved route to /ranking */}
                                        <Route path="*" element={<Navigate to="/ranking" replace />} />
                                    </Routes>
                                </main>
                            </div>
                            <Footer />
                        </userContext.Provider>
                    </headerFetchLoaderContext.Provider>
                </appDataContext.Provider>
            </div>
        </BrowserRouter>
    );
}
