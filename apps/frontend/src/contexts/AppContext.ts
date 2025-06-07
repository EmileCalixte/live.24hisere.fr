/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import type { CustomRunnerCategory, PublicUser } from "@live24hisere/core/types";
import { Theme } from "../constants/theme";
import type { ReactStateSetter } from "../types/utils/react";

export interface AppContext {
  appData: {
    /**
     * The error triggered if last app data request failed
     */
    fetchError: unknown;

    /**
     * Date and time the runners' data was exported from the timing system
     */
    lastUpdateTime: Date;

    /**
     * Difference between server time and client time in seconds. > 0 if the server is ahead, < 0 otherwise.
     */
    serverTimeOffset: number;

    /**
     * Whether the app is accessible or not
     */
    isAppEnabled: boolean;
    setIsAppEnabled: (isAppEnabled: boolean) => void;

    /**
     * The ID of the edition to be auto-selected if no edition is selected
     */
    currentEditionId: number | null;

    customRunnerCategories: CustomRunnerCategory[];

    /**
     * If the app is disabled, the message to be displayed
     */
    disabledAppMessage: string | null;
  };

  headerFetchLoader: {
    /**
     * A value incremented when a request is in progress, decremented when a request is completed.
     * The header loader should be displayed if this value is > 0.
     */
    fetchLevel: number;

    incrementFetchLevel: () => void;
    decrementFetchLevel: () => void;
  };

  user: {
    /**
     * The access token used for authenticated API requests
     */
    accessToken: string | null;

    saveAccessToken: (accessToken: string) => void;

    /**
     * The user logged in. If undefined, user info was not fetched yet.
     */
    user: PublicUser | null | undefined;

    setUser: (user: PublicUser | null | undefined) => void;

    logout: () => void;
  };

  theme: {
    theme: Theme;
    setTheme: ReactStateSetter<Theme>;
  };
}

export const appContext = React.createContext<AppContext>({
  appData: {
    fetchError: null,
    lastUpdateTime: new Date(),
    serverTimeOffset: 0,
    isAppEnabled: false,
    setIsAppEnabled: () => {},
    currentEditionId: null,
    customRunnerCategories: [],
    disabledAppMessage: null,
  },
  headerFetchLoader: {
    fetchLevel: 0,
    incrementFetchLevel: () => {},
    decrementFetchLevel: () => {},
  },
  user: {
    accessToken: null,
    saveAccessToken: () => {},
    user: undefined,
    setUser: () => {},
    logout: () => {},
  },
  theme: {
    theme: Theme.LIGHT,
    setTheme: () => {},
  },
});
