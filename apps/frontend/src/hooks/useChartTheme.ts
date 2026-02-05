import React from "react";
import { Theme } from "../constants/theme";
import { appContext } from "../contexts/AppContext";

/**
 * Returns CanvasJS theme name regarding app theme
 *
 * @deprecated delete this file when CanvasJS is removed
 */
export function useChartTheme(): string {
  const { theme } = React.useContext(appContext).theme;

  return theme === Theme.DARK ? "dark2" : "light2";
}
