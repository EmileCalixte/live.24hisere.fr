import type React from "react";
import { useContext } from "react";
import { Theme } from "../../../constants/theme";
import { appContext } from "../../App";
import AdminHeader from "./AdminHeader";
import FetchAppDataErrorHeader from "./FetchAppDataErrorHeader";
import HeaderFetchLoader from "./HeaderFetchLoader";
import Navbar from "./Navbar";

export default function Header(): React.ReactElement {
  const {
    user: { user },
    headerFetchLoader: { fetchLevel },
    appData: { fetchError, isAppEnabled },
    theme: { setTheme },
  } = useContext(appContext);

  return (
    <header id="app-header">
      {user && <AdminHeader />}

      <div id="app-header-main-section">
        <div id="app-header-logo-container">
          <img alt="Logo" src="/img/24hisere.svg" />
        </div>

        {(isAppEnabled || user) && <Navbar />}

        <div>
          <button
            onClick={() => {
              setTheme((current) => (current === Theme.DARK ? Theme.LIGHT : Theme.DARK));
            }}
          >
            toggle theme
          </button>
        </div>

        <div className="flex-grow-1" />

        {fetchLevel > 0 && <HeaderFetchLoader />}
      </div>

      {!!fetchError && <FetchAppDataErrorHeader />}
    </header>
  );
}
