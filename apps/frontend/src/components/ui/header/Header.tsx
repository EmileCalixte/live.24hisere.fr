import React from "react";
import { RESPONSIVE_MENU_BREAKPOINT_PX } from "../../../constants/ui/navMenu";
import { appContext } from "../../../contexts/AppContext";
import { navMenuContext } from "../../../contexts/NavMenuContext";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { Card } from "../Card";
import AdminHeader from "./AdminHeader";
import FetchAppDataErrorHeader from "./FetchAppDataErrorHeader";
import HeaderFetchLoader from "./HeaderFetchLoader";
import { HeaderResponsiveMenuButton } from "./HeaderResponsiveMenuButton";
import { HeaderThemeButton } from "./HeaderThemeButton";

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
    <header id="app-header" className="print:hidden">
      {user && <AdminHeader />}

      <Card
        id="app-header-main-section"
        shape="square"
        padding="no"
        border="bottom-only"
        className="flex h-16 px-3 lg:px-8"
      >
        <div className="flex grow basis-0">
          {(isAppEnabled || user) && showResponsiveMenuButton && <HeaderResponsiveMenuButton />}
        </div>

        <div className="inline-flex h-full items-center pr-3 md:pr-5">
          <img alt="" src="/img/24hisere.svg" className="h-[70%] md:h-[90%]" />
        </div>

        <div className="flex grow basis-0 justify-end">
          {fetchLevel > 0 && <HeaderFetchLoader />}
          <HeaderThemeButton />
        </div>
      </Card>

      {!!fetchError && <FetchAppDataErrorHeader />}
    </header>
  );
}
