import React from "react";
import TestCanvas from "./TestCanvas";

class App extends React.Component {
    render = () => {
        return (
            <div className="app">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm">
                            App
                        </div>
                        <div className="col-sm">
                            <TestCanvas/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
