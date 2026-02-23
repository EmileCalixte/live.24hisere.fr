/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import type { ReactStateSetter } from "../types/utils/react";

export interface NavMenuContext {
  showResponsiveNavMenu: boolean;
  setShowResponsiveNavMenu: ReactStateSetter<boolean>;
}

export const navMenuContext = React.createContext<NavMenuContext>({
  showResponsiveNavMenu: false,
  setShowResponsiveNavMenu: () => {},
});

export function NavMenuProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [showResponsiveNavMenu, setShowResponsiveNavMenu] = React.useState(false);

  const value = React.useMemo<NavMenuContext>(
    () => ({ showResponsiveNavMenu, setShowResponsiveNavMenu }),
    [showResponsiveNavMenu],
  );

  return React.createElement(navMenuContext.Provider, { value }, children);
}
