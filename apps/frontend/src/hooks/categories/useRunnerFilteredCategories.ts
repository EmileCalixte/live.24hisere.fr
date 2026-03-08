import React from "react";
import type { RaceRunner } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { useGetRunnerCategory } from "../useGetRunnerCategory";

export function useRunnerFilteredCategories(
  categories: Record<string, string>,
  runners: RaceRunner[] | undefined,
  date: Date | undefined,
): Record<string, string> | null {
  const getCategory = useGetRunnerCategory();

  return React.useMemo(() => {
    if (!runners || !date) {
      return null;
    }

    const categoriesInRanking = new Set<string>();

    for (const runner of runners) {
      categoriesInRanking.add(getCategory(runner, date).code);
    }

    const categoryCodesToRemove: string[] = [];
    const allCategoryCodes = Object.keys(categories);

    for (const categoryCode of allCategoryCodes) {
      if (!categoriesInRanking.has(categoryCode)) {
        categoryCodesToRemove.push(categoryCode);
      }
    }

    return objectUtils.excludeKeys(categories, categoryCodesToRemove);
  }, [runners, date, categories, getCategory]);
}
