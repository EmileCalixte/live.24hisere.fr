import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import ToastService from "./services/ToastService";
import { getErrorMessageToDisplay } from "./utils/apiUtils";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const errorMessage = getErrorMessageToDisplay(error, query);

      if (errorMessage) {
        ToastService.getToastr().error(errorMessage);
      }

      console.error(error);
    },
  }),
});

root.render(
  <NuqsAdapter>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </NuqsAdapter>,
);
