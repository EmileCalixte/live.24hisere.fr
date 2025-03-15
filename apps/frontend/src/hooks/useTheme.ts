import React from "react";
import { Theme } from "../constants/theme";
import type { ReactStateSetter } from "../types/utils/react";

interface UseTheme {
  theme: Theme;
  setTheme: ReactStateSetter<Theme>;
}

export function useTheme(): UseTheme {
  const windowMatchDarkRef = React.useRef(window.matchMedia("(prefers-color-scheme: dark)"));

  const bodyRef = React.useRef(document.querySelector("body"));

  const localStorageTheme = localStorage.getItem("preferredTheme");

  const prefersDarkScheme = localStorageTheme ? localStorageTheme === Theme.DARK : windowMatchDarkRef.current.matches;

  const [theme, setTheme] = React.useState(prefersDarkScheme ? Theme.DARK : Theme.LIGHT);

  React.useEffect(() => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    localStorage.setItem("preferredTheme", theme);
    body.setAttribute("data-theme", theme);
  }, [theme]);

  // Auto-switch theme when system color scheme changes
  React.useEffect(() => {
    const matchDark = windowMatchDarkRef.current;

    function onChange(e: MediaQueryListEvent): void {
      e.matches ? setTheme(Theme.DARK) : setTheme(Theme.LIGHT);
    }

    matchDark.addEventListener("change", onChange);

    return () => {
      matchDark.removeEventListener("change", onChange);
    };
  }, []);

  return { theme, setTheme };
}
