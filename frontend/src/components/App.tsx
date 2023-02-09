import React, {createContext} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {User} from "../types/User";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Ranking from "./pages/ranking/Ranking";
import RunnerDetails from "./pages/runner-details/RunnerDetails";
import ApiUtil from "../util/ApiUtil";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";
import Util from "../util/Util";
import ToastUtil from "../util/ToastUtil";

type ServerTimeOffsetContext = {
    /**
     * Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
     */
    serverTimeOffset: number;
}

type UserContext = {
    user: User | null | undefined;
}

export const serverTimeOffsetContext = createContext<ServerTimeOffsetContext>({
    serverTimeOffset: 0,
})

export const userContext = createContext<UserContext>({
    user: undefined,
});

let instance: App;

const FETCH_RACE_DATA_INTERVAL_TIME = 60 * 1000;

class App extends React.Component {
    state = {
        isLoading: true,
        isFetching: false,
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

    constructor() {
        if (instance) {
            throw new Error('App has already been instanciated');
        }

        // @ts-ignore
        super();

        instance = this;
    }

    componentDidMount = async () => {
        await this.fetchRaceData();

        this.fetchRaceDataInterval = setInterval(this.fetchRaceData, FETCH_RACE_DATA_INTERVAL_TIME);

        this.setState({
            isLoading: false,
        });

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

    saveAccessToken = (accessToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        this.setState({accessToken});
    }

    forgetAccessToken = () => {
        localStorage.removeItem('accessToken');
        this.setState({accessToken: null});
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
                    <serverTimeOffsetContext.Provider value={{serverTimeOffset: this.state.serverTimeOffset}}>
                        <userContext.Provider value={{user: this.state.user}}>
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
                </div>
            </BrowserRouter>
        );
    }
}

export { instance as app };

export default App;
