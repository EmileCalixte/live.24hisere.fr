import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Ranking from "./pages/ranking/Ranking";
import RunnerDetails from "./pages/runner-details/RunnerDetails";
import ApiUtil from "../util/ApiUtil";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";
import Util from "../util/Util";
import ToastUtil from "../util/ToastUtil";

let instance;

export const RACE_DURATION = 24 * 60 * 60 * 1000 - 1; // in ms

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
        user: null,
        redirect: null, // Used to redirect the user to a specified location, for example when user logs out
    }

    constructor() {
        if (instance) {
            throw new Error('App has already been instanciated');
        }

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
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.accessToken !== this.state.accessToken) {
            this.onAccessTokenUpdate();
        }
    }

    componentWillUnmount() {
        clearInterval(this.fetchRaceDataInterval);
    }

    saveAccessToken = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
        this.setState({accessToken});
    }

    forgetAccessToken = () => {
        localStorage.removeItem('accessToken');
        this.setState({accessToken: null});
    }

    logout = () => {
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

    computeServerTimeOffset = (serverTimeString) => {
        const serverTime = new Date(serverTimeString);
        const clientTime = new Date();

        const timeOffsetMs = serverTime - clientTime;

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
        const response = await ApiUtil.performAPIRequest('/race-data', {}, false);
        const responseJson = await response.json();

        this.saveRaceData(responseJson);
    }

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
                    <div id="app-content-wrapper">
                        <Header />
                        <div id="app-content">
                            <div id="page-content" className="container-fluid">
                                <Routes>
                                    <Route exact path="/ranking" element={<Ranking />} />
                                    <Route exact path="/runner-details" element={<RunnerDetails />} />
                                    <Route exact path="/runner-details/:runnerId" element={<RunnerDetails />} />

                                    <Route exact path="/login" element={<Login />} />

                                    <Route path="/admin/*" element={<Admin />} />

                                    {/* Redirect any unresolved route to /ranking */}
                                    <Route path="*" element={<Navigate to="/ranking" replace />} />
                                </Routes>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }
}

export { instance as app };

export default App;
