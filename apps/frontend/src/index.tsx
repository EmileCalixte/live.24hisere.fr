import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "toastr2/dist/toastr.min.css";
import App from "./components/App";
import "./css/forms.css";
import "./css/index.css";
import "./css/toastr-override.css";
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

      // eslint-disable-next-line no-console
      console.error(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _, __, mutation) => {
      const errorMessage = getErrorMessageToDisplay(error, mutation);

      if (errorMessage) {
        ToastService.getToastr().error(errorMessage);
      }

      // eslint-disable-next-line no-console
      console.error(error);
    },
    onSuccess: (_, __, ___, mutation) => {
      const successMessage = mutation.meta?.successToast;

      if (successMessage) {
        ToastService.getToastr().success(successMessage);
      }
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
