import "bootstrap/dist/css/bootstrap-grid.css";
import "bootstrap/dist/css/bootstrap-utilities.css";
import { NuqsAdapter } from "nuqs/adapters/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "toastr2/dist/toastr.min.css";
import App from "./components/App";
import "./css/forms.css";
import "./css/index.css";
import "./css/toastr-override.css";
import "./css/utils.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

root.render(
  <NuqsAdapter>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </NuqsAdapter>,
);
