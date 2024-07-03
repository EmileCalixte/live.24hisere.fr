import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap-utilities.css";
import "./css/index.css";
import "./css/forms.css";
import "./css/utils.css";
import "toastr2/dist/toastr.min.css";
import "./css/toastr-override.css";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";

const container = document.getElementById("root");

if (!container) {
    throw new Error("Root element not found");
}

const root = createRoot(container);

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
);
