import React, {createContext} from "react";
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

type HeaderFetchLoaderContext = {
    /**
     * A value incremented when a request is in progress, decremented when a request is completed.
     * The header loader should be displayed if this value is > 0.
     */
    fetchLevel: number;

    incrementFetchLevel: () => any;
    decrementFetchLevel: () => any;
}

type LastUpdateTimeContext = {
    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: Date;
}

type ServerTimeOffsetContext = {
    /**
     * Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
     */
    serverTimeOffset: number;
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

export const headerFetchLoaderContext = createContext<HeaderFetchLoaderContext>({
    fetchLevel: 0,
    incrementFetchLevel: () => {},
    decrementFetchLevel: () => {},
});

export const lastUpdateTimeContext = createContext<LastUpdateTimeContext>({
    lastUpdateTime: new Date(),
});

export const serverTimeOffsetContext = createContext<ServerTimeOffsetContext>({
    serverTimeOffset: 0,
});

export const userContext = createContext<UserContext>({
    accessToken: null,
    saveAccessToken: () => {},
    user: undefined,
    setUser: () => {},
    logout: () => {},
});

const FETCH_RACE_DATA_INTERVAL_TIME = 60 * 1000;

class App extends React.Component {
    state = {
        fetchLevel: 0,
        firstLapDistance: 0,
        lapDistance: 0,
        raceStartTime: new Date(),
        lastUpdateTime: new Date(),
        serverTimeOffset: 0, // Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
        accessToken: localStorage.getItem('accessToken'),
        user: undefined, // If null, user is not logged in. If undefined, user info was not fetched yet
        redirect: null, // Used to redirect the user to a specified location, for example when user logs out
    }

    private fetchRaceDataInterval: NodeJS.Timer | undefined;

    componentDidMount = async () => {
        window.addEventListener(EVENT_API_REQUEST_STARTED, () => this.incrementFetchLevel());
        window.addEventListener(EVENT_API_REQUEST_ENDED, () => this.decrementFetchLevel());

        await this.fetchRaceData();

        this.fetchRaceDataInterval = setInterval(this.fetchRaceData, FETCH_RACE_DATA_INTERVAL_TIME);

        if (this.state.accessToken !== null) {
            if (await this.fetchCurrentUserInfo() === false) {
                this.forgetAccessToken();
                this.setState({user: null});
                ToastUtil.getToastr().error('Vous avez été déconnecté');
            }
        } else {
            this.setState({user: null});
        }
    }

    // @ts-ignore
    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.accessToken !== this.state.accessToken) {
            this.onAccessTokenUpdate();
        }
    }

    componentWillUnmount() {
        clearInterval(this.fetchRaceDataInterval);
    }

    incrementFetchLevel() {
        console.log("INCREMENT", this.state.fetchLevel);

        this.setState((prevState => {
            return {
                ...prevState,
                // @ts-ignore
                fetchLevel: prevState.fetchLevel + 1,
            };
        }));
    }

    decrementFetchLevel() {
        console.log("DECREMENT", this.state.fetchLevel);

        this.setState((prevState => {
            return {
                ...prevState,
                // @ts-ignore
                fetchLevel: Math.max(0, prevState.fetchLevel - 1),
            };
        }));
    }

    saveAccessToken = (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        this.setState({accessToken});
    }

    forgetAccessToken = () => {
        localStorage.removeItem('accessToken');
        this.setState({accessToken: null});
    }

    setUser = (user: User | null | undefined) => {
        this.setState({user});
    }

    logout = () => {
        ApiUtil.performAuthenticatedAPIRequest('/auth/logout', this.state.accessToken, {
            method: 'POST',
        });

        this.forgetAccessToken();

        this.setState({
            user: null,
            redirect: '/',
        });

        ToastUtil.getToastr().success('Vous avez été déconnecté');
    }

    onAccessTokenUpdate = () => {
        Util.verbose('Access token updated');
        if (this.state.accessToken === null) {
            this.setState({
                username: null,
            });
            return;
        }

        this.fetchCurrentUserInfo();
    }

    computeServerTimeOffset = (serverTimeString: string) => {
        const serverTime = new Date(serverTimeString);
        const clientTime = new Date();

        const timeOffsetMs = serverTime.getTime() - clientTime.getTime();

        this.setState({
            serverTimeOffset: Math.round(timeOffsetMs / 1000),
        });
    }

    fetchCurrentUserInfo = async () => {
        Util.verbose('Fetching user info');
        const response = await ApiUtil.performAuthenticatedAPIRequest('/auth/current-user-info', this.state.accessToken);
        const responseJson = await response.json();

        Util.verbose('User info', responseJson);

        this.setState({
            user: responseJson.user
        });

        return response.ok;
    }

    fetchRaceData = async () => {
        const response = await ApiUtil.performAPIRequest('/race-data');
        const responseJson = await response.json();

        this.saveRaceData(responseJson);
    }

    // @ts-ignore
    saveRaceData = async (raceData) => {
        this.computeServerTimeOffset(raceData.currentTime);

        this.setState({
            firstLapDistance: raceData.firstLapDistance,
            lapDistance: raceData.lapDistance,
            raceStartTime: new Date(raceData.raceStartTime),
            lastUpdateTime: new Date(raceData.lastUpdateTime),
        });
    }

    render = () => {
        if (this.state.redirect !== null) {
            const url = this.state.redirect;

            setTimeout(() => {
                this.setState({redirect: null});
            }, 0);

            return (
                <BrowserRouter>
                    <Navigate to={url} />
                </BrowserRouter>
            );
        }

        return (
            <BrowserRouter>
                <div id="app">
                    <headerFetchLoaderContext.Provider value={{
                        fetchLevel: this.state.fetchLevel,
                        incrementFetchLevel: this.incrementFetchLevel,
                        decrementFetchLevel: this.decrementFetchLevel,
                    }}>
                        <lastUpdateTimeContext.Provider value={{lastUpdateTime: this.state.lastUpdateTime}}>
                            <serverTimeOffsetContext.Provider value={{serverTimeOffset: this.state.serverTimeOffset}}>
                                <userContext.Provider value={{
                                    accessToken: this.state.accessToken,
                                    saveAccessToken: this.saveAccessToken,
                                    user: this.state.user,
                                    setUser: this.setUser,
                                    logout: this.logout,
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
                            </serverTimeOffsetContext.Provider>
                        </lastUpdateTimeContext.Provider>
                    </headerFetchLoaderContext.Provider>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
