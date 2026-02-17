import type React from "react";
import { RESPONSIVE_MENU_BREAKPOINT_PX } from "../../../constants/ui/navMenu";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { NavMenuResponsiveContainer } from "./NavMenuResponsiveContainer";
import { NavMenuWideScreenContainer } from "./NavMenuWideScreenContainer";

export function NavMenuContainer(): React.ReactElement {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <>
      {windowWidth >= RESPONSIVE_MENU_BREAKPOINT_PX && <NavMenuWideScreenContainer />}
      <NavMenuResponsiveContainer />
    </>
  );
}
