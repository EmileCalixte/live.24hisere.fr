import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Ranking from "./pages/ranking/Ranking";
import RunnerDetails from "./pages/runner-details/RunnerDetails";
import ApiUtil from "../util/ApiUtil";
import Login from "./pages/login/Login";

let instance;

export const RACE_DURATION = 24 * 60 * 60 * 1000 - 1; // in ms

class App extends React.Component {
    state = {
        isLoading: true,
        isFetching: false,
        firstLapDistance: 0,
        lapDistance: 0,
        raceStartTime: new Date(),
        lastUpdateTime: new Date(),
        serverTimeOffset: 0, // Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
    }

    constructor() {
        if (instance) {
            throw new Error('App has already been instanciated');
        }

        super();

        instance = this;
    }

    componentDidMount = async () => {
        await this.fetchInitialData();
        this.setState({
            isLoading: false,
        })
    }

    computeServerTimeOffset = (serverTimeString) => {
        const serverTime = new Date(serverTimeString);
        const clientTime = new Date();

        const timeOffsetMs = serverTime - clientTime;

        this.setState({
            serverTimeOffset: Math.round(timeOffsetMs / 1000),
        });
    }

    fetchInitialData = async () => {
        const response = await ApiUtil.performAPIRequest('/initial-data', {}, false);
        const responseJson = await response.json();

        this.saveMetadata(responseJson);
    }

    saveMetadata = async (metadata) => {
        this.computeServerTimeOffset(metadata.currentTime);

        this.setState({
            firstLapDistance: metadata.firstLapDistance,
            lapDistance: metadata.lapDistance,
            raceStartTime: new Date(metadata.raceStartTime),
            lastUpdateTime: new Date(metadata.lastUpdateTime),
        });
    }

    render = () => {
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
