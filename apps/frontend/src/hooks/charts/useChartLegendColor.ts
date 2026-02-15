import React from "react";
import { Theme } from "../../constants/theme";
import { appContext } from "../../contexts/AppContext";

/**
 * Returns text color for ChartJS legend labels regarding app theme
 */
export function useChartLegendColor(): string {
  const { theme } = React.useContext(appContext).theme;

  return theme === Theme.DARK ? "oklch(0.922 0 0)" : "oklch(0.205 0 0)";
}
