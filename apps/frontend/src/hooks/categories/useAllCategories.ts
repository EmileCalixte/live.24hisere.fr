import React from "react";
import { getCategoryList } from "@emilecalixte/ffa-categories";
import type { CustomRunnerCategory } from "@live24hisere/core/types";

/**
 * @param date The date for which categories should be retrieved
 * @param customRunnerCategories Optional additional categories
 * @returns A record containing all categories existing at the given date, plus any custom categories, with category codes as keys and category names as values
 */
export function useAllCategories(
  date: Date | undefined,
  customRunnerCategories: Array<Omit<CustomRunnerCategory, "id">> = [],
): Record<string, string> {
  return React.useMemo(() => {
    if (!date) {
      return {};
    }

    const allCategories: Record<string, string> = getCategoryList(date);

    for (const customCategory of customRunnerCategories) {
      allCategories[customCategory.code] = customCategory.name;
    }

    return allCategories;
  }, [date, customRunnerCategories]);
}
