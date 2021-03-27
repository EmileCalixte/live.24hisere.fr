import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import Ranking from "./pages/ranking/Ranking";
import RunnerDetails from "./pages/runner-details/RunnerDetails";

class App extends React.Component {
    render = () => {
        return (
            <BrowserRouter>
                <div id="app">
                    <div id="app-content-wrapper">
                        <Header />
                        <div id="app-content">
                            <div id="page-content">
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
