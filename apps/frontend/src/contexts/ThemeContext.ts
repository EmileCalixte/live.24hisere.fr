/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { Theme } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import type { ReactStateSetter } from "../types/utils/react";

export interface ThemeContext {
  theme: Theme;
  setTheme: ReactStateSetter<Theme>;
}

export const themeContext = React.createContext<ThemeContext>({
  theme: Theme.LIGHT,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const { theme, setTheme } = useTheme();

  const value = React.useMemo<ThemeContext>(() => ({ theme, setTheme }), [theme, setTheme]);

  return React.createElement(themeContext.Provider, { value }, children);
}
