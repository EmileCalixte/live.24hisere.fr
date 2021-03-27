import React from "react";
import {BrowserRouter} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

class App extends React.Component {
    render = () => {
        return (
            <BrowserRouter>
                <div id="app">
                    <div id="app-content-wrapper">
                        <Header />
                        <div id="app-content">
                            Content
                        </div>
                    </div>
                    <Footer />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
