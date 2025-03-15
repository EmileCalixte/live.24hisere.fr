import React from "react";
import { appContext } from "../../../contexts/AppContext";
import AdminHeader from "./AdminHeader";
import FetchAppDataErrorHeader from "./FetchAppDataErrorHeader";
import HeaderFetchLoader from "./HeaderFetchLoader";
import { HeaderThemeButton } from "./HeaderThemeButton";
import Navbar from "./Navbar";

export default function Header(): React.ReactElement {
  const {
    user: { user },
    headerFetchLoader: { fetchLevel },
    appData: { fetchError, isAppEnabled },
  } = React.useContext(appContext);

  return (
    <header id="app-header" className="shadow-sm print:hidden">
      {user && <AdminHeader />}

      <div id="app-header-main-section" className="flex h-[64px] bg-white px-3 md:px-5 dark:bg-neutral-800">
        <div className="inline-flex h-full items-center pr-3 md:pr-5">
          <img alt="" src="/img/24hisere.svg" className="h-[70%] md:h-[90%]" />
        </div>

        {(isAppEnabled || user) && <Navbar />}

        <div className="grow-1" />

        {fetchLevel > 0 && <HeaderFetchLoader />}

        <HeaderThemeButton />
      </div>

      {!!fetchError && <FetchAppDataErrorHeader />}
    </header>
  );
}
