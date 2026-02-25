import React from "react";
import type { RaceRunner } from "@live24hisere/core/types";
import { appDataContext } from "../contexts/AppDataContext";
import { getRunnerCategory } from "../utils/categoryUtils";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useGetRunnerCategory() {
  const customCategories = React.useContext(appDataContext).customRunnerCategories;

  return React.useCallback(
    (runner: RaceRunner, date: Date) => getRunnerCategory(runner, date, customCategories),
    [customCategories],
  );
}
