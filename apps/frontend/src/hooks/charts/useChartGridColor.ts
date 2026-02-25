import React from "react";
import { Theme } from "../../constants/theme";
import { themeContext } from "../../contexts/ThemeContext";

/**
 * Returns grid color for ChartJS charts regarding app theme
 */
export function useChartGridColor(): string {
  const { theme } = React.useContext(themeContext);

  return theme === Theme.DARK ? "oklch(0.55 0 0)" : "oklch(0.8 0 0)";
}
