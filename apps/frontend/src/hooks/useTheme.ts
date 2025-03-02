import React from "react";
import { Theme } from "../constants/theme";
import type { ReactStateSetter } from "../types/utils/react";

interface UseTheme {
  theme: Theme;
  setTheme: ReactStateSetter<Theme>;
}

export function useTheme(): UseTheme {
  const bodyRef = React.useRef(document.querySelector("body"));

  const localStorageTheme = localStorage.getItem("preferredTheme");

  const prefersDarkScheme = localStorageTheme
    ? localStorageTheme === Theme.DARK
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = React.useState(prefersDarkScheme ? Theme.DARK : Theme.LIGHT);

  React.useEffect(() => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    localStorage.setItem("preferredTheme", theme);
    body.setAttribute("theme", theme);

    // Bootstrap specific
    if (theme === Theme.DARK) {
      body.setAttribute("data-bs-theme", "dark");
    } else {
      body.removeAttribute("data-bs-theme");
    }
  }, [theme]);

  return { theme, setTheme };
}
