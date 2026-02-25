/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { EVENT_API_REQUEST_ENDED, EVENT_API_REQUEST_STARTED } from "../utils/apiUtils";

export interface FetchLoaderContext {
  fetchLevel: number;
  incrementFetchLevel: () => void;
  decrementFetchLevel: () => void;
}

export const fetchLoaderContext = React.createContext<FetchLoaderContext>({
  fetchLevel: 0,
  incrementFetchLevel: () => {},
  decrementFetchLevel: () => {},
});

export function FetchLoaderProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [fetchLevel, setFetchLevel] = React.useState(0);

  const incrementFetchLevel = React.useCallback(() => {
    setFetchLevel((level) => level + 1);
  }, []);

  const decrementFetchLevel = React.useCallback(() => {
    setFetchLevel((level) => Math.max(0, level - 1));
  }, []);

  React.useEffect(() => {
    window.addEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
    window.addEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);

    return () => {
      window.removeEventListener(EVENT_API_REQUEST_STARTED, incrementFetchLevel);
      window.removeEventListener(EVENT_API_REQUEST_ENDED, decrementFetchLevel);
    };
  }, [incrementFetchLevel, decrementFetchLevel]);

  const value = React.useMemo<FetchLoaderContext>(
    () => ({ fetchLevel, incrementFetchLevel, decrementFetchLevel }),
    [fetchLevel, incrementFetchLevel, decrementFetchLevel],
  );

  return React.createElement(fetchLoaderContext.Provider, { value }, children);
}
