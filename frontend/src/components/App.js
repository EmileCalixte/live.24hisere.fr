import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Ranking from "./pages/ranking/Ranking";
import RunnerDetails from "./pages/runner-details/RunnerDetails";
import ApiUtil from "../util/ApiUtil";

class App extends React.Component {
    static FIRST_LAP_DISTANCE = 0;
    static LAP_DISTANCE = 0;
    static RACE_START_TIME = new Date();
    static LAST_UPDATE_TIME = new Date();

    componentDidMount = async () => {
        await this.fetchInitialData();
    }

    fetchInitialData = async () => {
        const response = await ApiUtil.performAPIRequest('/initial-data', {}, false);
        const responseJson = await response.json();

        console.log(responseJson);
        console.log(responseJson.currentTime);
        console.log(new Date(responseJson.currentTime));
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

export default App;
