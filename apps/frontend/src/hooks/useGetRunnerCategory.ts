import React from "react";
import type { RaceRunner } from "@live24hisere/core/types";
import { appContext } from "../contexts/AppContext";
import { getRunnerCategory } from "../utils/categoryUtils";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useGetRunnerCategory() {
  const customCategories = React.useContext(appContext).appData.customRunnerCategories;

  return React.useCallback(
    (runner: RaceRunner, date: Date) => getRunnerCategory(runner, date, customCategories),
    [customCategories],
  );
}
