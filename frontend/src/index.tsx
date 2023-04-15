import React from "react";
import {createRoot} from "react-dom/client";
import "bootstrap/dist/css/bootstrap-grid.css";
import "./css/index.css";
import "./css/forms.css";
import "./lib/fontawesome/css/all.min.css";
import "toastr2/dist/toastr.min.css";
import "./css/toastr-override.css";
import App from "./components/App";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(<App />);
