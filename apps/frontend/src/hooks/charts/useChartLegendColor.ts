import React from "react";
import { Theme } from "../../constants/theme";
import { themeContext } from "../../contexts/ThemeContext";

/**
 * Returns text color for ChartJS legend labels regarding app theme
 */
export function useChartLegendColor(): string {
  const { theme } = React.useContext(themeContext);

  return theme === Theme.DARK ? "oklch(0.922 0 0)" : "oklch(0.205 0 0)";
}
