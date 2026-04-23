import React from "react";
import { TrackedEvent } from "../constants/eventTracking/customEventNames";
import { Theme } from "../constants/theme";
import type { ReactStateSetter } from "../types/utils/react";
import { trackEvent } from "../utils/eventTracking/eventTrackingUtils";

interface UseTheme {
  theme: Theme;
  setTheme: ReactStateSetter<Theme>;
}

const windowMatchDark = window.matchMedia("(prefers-color-scheme: dark)");

export function useTheme(): UseTheme {
  const bodyRef = React.useRef(document.querySelector("body"));
  const isPrinting = React.useRef(false);

  const localStorageTheme = localStorage.getItem("preferredTheme");

  const prefersDarkScheme = localStorageTheme ? localStorageTheme === Theme.DARK : windowMatchDark.matches;

  const [theme, setTheme] = React.useState(prefersDarkScheme ? Theme.DARK : Theme.LIGHT);

  React.useEffect(() => {
    const body = bodyRef.current;

    if (!body) {
      return;
    }

    localStorage.setItem("preferredTheme", theme);
    body.setAttribute("data-theme", theme);
  }, [theme]);

  React.useEffect(() => {
    function onBeforePrint(): void {
      isPrinting.current = true;
    }

    function onAfterPrint(): void {
      isPrinting.current = false;
    }

    window.addEventListener("beforeprint", onBeforePrint);
    window.addEventListener("afterprint", onAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", onBeforePrint);
      window.removeEventListener("afterprint", onAfterPrint);
    };
  }, []);

  // Auto-switch theme when system color scheme changes
  React.useEffect(() => {
    function onChange(e: MediaQueryListEvent): void {
      // Ignore prefers-color-scheme changes triggered by the browser during print rendering
      if (isPrinting.current) {
        return;
      }

      if (e.matches && theme === Theme.LIGHT) {
        trackEvent(TrackedEvent.AUTO_SWITCH_DARK_THEME);
        setTheme(Theme.DARK);
      } else if (!e.matches && theme === Theme.DARK) {
        trackEvent(TrackedEvent.AUTO_SWITCH_LIGHT_THEME);
        setTheme(Theme.LIGHT);
      }
    }

    windowMatchDark.addEventListener("change", onChange);

    return () => {
      windowMatchDark.removeEventListener("change", onChange);
    };
  }, [theme]);

  return { theme, setTheme };
}
