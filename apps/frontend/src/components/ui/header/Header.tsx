import React from "react";
import { RESPONSIVE_MENU_BREAKPOINT_PX } from "../../../constants/ui/navMenu";
import { appContext } from "../../../contexts/AppContext";
import { navMenuContext } from "../../../contexts/NavMenuContext";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import AdminHeader from "./AdminHeader";
import FetchAppDataErrorHeader from "./FetchAppDataErrorHeader";
import HeaderFetchLoader from "./HeaderFetchLoader";
import { HeaderResponsiveMenuButton } from "./HeaderResponsiveMenuButton";
import { HeaderThemeButton } from "./HeaderThemeButton";
import Navbar from "./Navbar";

export default function Header(): React.ReactElement {
  const {
    user: { user },
    headerFetchLoader: { fetchLevel },
    appData: { fetchError, isAppEnabled },
  } = React.useContext(appContext);

  const { showResponsiveNavMenu, setShowResponsiveNavMenu } = React.useContext(navMenuContext);

  const { width: windowWidth } = useWindowDimensions();

  const showResponsiveMenuButton = windowWidth < RESPONSIVE_MENU_BREAKPOINT_PX;

  React.useEffect(() => {
    if (!showResponsiveMenuButton && showResponsiveNavMenu) {
      setShowResponsiveNavMenu(false);
    }
  }, [setShowResponsiveNavMenu, showResponsiveMenuButton, showResponsiveNavMenu]);

  return (
    <header id="app-header" className="shadow-sm print:hidden">
      {user && <AdminHeader />}

      <div id="app-header-main-section" className="flex h-16 bg-white px-3 md:px-5 dark:bg-neutral-800">
        <div className="flex grow basis-0">
          {(isAppEnabled || user) && showResponsiveMenuButton && <HeaderResponsiveMenuButton />}
          {(isAppEnabled || user) && <Navbar />}
        </div>

        <div className="inline-flex h-full items-center pr-3 md:pr-5">
          <img alt="" src="/img/24hisere.svg" className="h-[70%] md:h-[90%]" />
        </div>

        <div className="flex grow basis-0 justify-end">
          {fetchLevel > 0 && <HeaderFetchLoader />}
          <HeaderThemeButton />
        </div>
      </div>

      {!!fetchError && <FetchAppDataErrorHeader />}
    </header>
  );
}
