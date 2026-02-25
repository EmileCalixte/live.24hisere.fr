/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import type { CustomRunnerCategory } from "@live24hisere/core/types";
import { useGetAppData } from "../hooks/api/requests/public/appData/useGetAppData";
import { verbose } from "../utils/utils";

export interface AppDataContext {
  isLoading: boolean;
  fetchError: unknown;
  lastUpdateTime: Date;
  serverTimeOffset: number;
  isAppEnabled: boolean;
  setIsAppEnabled: (isAppEnabled: boolean) => void;
  currentEditionId: number | null;
  customRunnerCategories: CustomRunnerCategory[];
  disabledAppMessage: string | null;
}

export const appDataContext = React.createContext<AppDataContext>({
  isLoading: true,
  fetchError: null,
  lastUpdateTime: new Date(),
  serverTimeOffset: 0,
  isAppEnabled: false,
  setIsAppEnabled: () => {},
  currentEditionId: null,
  customRunnerCategories: [],
  disabledAppMessage: null,
});

export function AppDataProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchAppDataError, setFetchAppDataError] = React.useState<unknown>(null);
  const [lastUpdateTime, setLastUpdateTime] = React.useState(new Date());
  const [serverTimeOffset, setServerTimeOffset] = React.useState(0);
  const [isAppEnabled, setIsAppEnabled] = React.useState(false);
  const [disabledAppMessage, setDisabledAppMessage] = React.useState<string | null>(null);
  const [currentEditionId, setCurrentEditionId] = React.useState<number | null>(null);
  const [customRunnerCategories, setCustomRunnerCategories] = React.useState<CustomRunnerCategory[]>([]);

  const getAppDataQuery = useGetAppData();
  const appData = getAppDataQuery.data;

  React.useEffect(() => {
    if (!appData) {
      return;
    }

    verbose("App data", appData);

    setIsAppEnabled(appData.isAppEnabled);
    setDisabledAppMessage(appData.disabledAppMessage);

    setCurrentEditionId(appData.currentEditionId);

    setCustomRunnerCategories(appData.customRunnerCategories);

    setLastUpdateTime(new Date(appData.lastUpdateTime ?? 0));

    const serverTime = new Date(appData.currentTime);
    const clientTime = new Date();

    const timeOffsetMs = serverTime.getTime() - clientTime.getTime();

    setServerTimeOffset(Math.round(timeOffsetMs / 1000));

    setIsLoading(false);
  }, [appData]);

  React.useEffect(() => {
    setFetchAppDataError(getAppDataQuery.error);
  }, [getAppDataQuery.error]);

  const value = React.useMemo<AppDataContext>(
    () => ({
      isLoading,
      fetchError: fetchAppDataError,
      lastUpdateTime,
      serverTimeOffset,
      isAppEnabled,
      setIsAppEnabled,
      currentEditionId,
      customRunnerCategories,
      disabledAppMessage,
    }),
    [
      isLoading,
      fetchAppDataError,
      lastUpdateTime,
      serverTimeOffset,
      isAppEnabled,
      currentEditionId,
      customRunnerCategories,
      disabledAppMessage,
    ],
  );

  return React.createElement(appDataContext.Provider, { value }, children);
}
