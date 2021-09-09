import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Ranking from "./pages/ranking/Ranking";
import RunnerDetails from "./pages/runner-details/RunnerDetails";
import ApiUtil from "../util/ApiUtil";

let instance;

class App extends React.Component {
    state = {
        isLoading: true,
        firstLapDistance: 0,
        lapDistance: 0,
        raceStartTime: new Date(),
        lastUpdateTime: new Date(),
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

        console.log('OFFSET', timeOffsetMs);
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
                                <Switch>
                                    <Route exact path="/ranking" component={Ranking} />
                                    <Route exact path="/runner-details" component={RunnerDetails} />
                                    <Route> {/* Redirect any unresolved route to /ranking */}
                                        <Redirect to="/ranking" />
                                    </Route>
                                </Switch>
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
