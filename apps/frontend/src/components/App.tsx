import React from "react";
import { Helmet } from "react-helmet";
import { Navigate, Route, Routes, useMatch } from "react-router-dom";
import { APP_BASE_TITLE } from "../constants/app";
import { appDataContext, AppDataProvider } from "../contexts/AppDataContext";
import { FetchLoaderProvider } from "../contexts/FetchLoaderContext";
import { NavMenuProvider } from "../contexts/NavMenuContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { userContext, UserProvider } from "../contexts/UserContext";
import CircularLoader from "./ui/CircularLoader";
import Footer from "./ui/footer/Footer";
import Header from "./ui/header/Header";
import { NavMenuContainer } from "./ui/navMenu/NavMenuContainer";
import DisabledAppView from "./views/DisabledAppView";
import LoginView from "./views/LoginView";

const Admin = React.lazy(async () => await import("./views/admin/Admin"));
const About = React.lazy(async () => await import("./views/AboutView"));
const RacesView = React.lazy(async () => await import("./views/RacesView"));
const RunnerDetailsView = React.lazy(async () => await import("./views/RunnerDetailsView"));
const SearchRunnerView = React.lazy(async () => await import("./views/SearchRunnerView"));

export default function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <FetchLoaderProvider>
        <AppDataProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </AppDataProvider>
      </FetchLoaderProvider>
    </ThemeProvider>
  );
}

function AppContent(): React.ReactElement {
  const { isLoading, isAppEnabled } = React.useContext(appDataContext);
  const { user } = React.useContext(userContext);

  const isLoginRoute = !!useMatch("/login");
  const isAdminRoute = !!useMatch("/admin/*");
  const isAboutRoute = !!useMatch("/about");

  const isBypassDisabledAppRoute = isLoginRoute || isAdminRoute || isAboutRoute;

  const showDisabledAppMessage = !user && !isAppEnabled && !isBypassDisabledAppRoute;

  return (
    <div id="app" className="flex min-h-screen flex-col">
      <Helmet>
        <title>{APP_BASE_TITLE}</title>
      </Helmet>
      <NavMenuProvider>
        <div id="app-content-wrapper" className="flex flex-1 flex-col">
          <Header />

          <div className="flex flex-1">
            {(isAppEnabled || !!user) && <NavMenuContainer />}

            <main id="page-wrapper" className="mt-3 flex-1 pb-8 lg:mt-6">
              {isLoading ? (
                <CircularLoader />
              ) : showDisabledAppMessage ? (
                <DisabledAppView />
              ) : (
                <React.Suspense fallback={<CircularLoader />}>
                  <Routes>
                    <Route path="/login" element={<LoginView />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/races" element={<RacesView />} />
                    <Route path="/runner-details" element={<RunnerDetailsView />} />
                    <Route path="/runner-details/search" element={<SearchRunnerView />} />
                    <Route path="/runner-details/:runnerId" element={<RunnerDetailsView />} />

                    {/* Redirect any unresolved route to /races */}
                    <Route path="*" element={<Navigate to="/races" replace />} />
                  </Routes>
                </React.Suspense>
              )}
            </main>
          </div>
        </div>
      </NavMenuProvider>
      <Footer />
    </div>
  );
}
