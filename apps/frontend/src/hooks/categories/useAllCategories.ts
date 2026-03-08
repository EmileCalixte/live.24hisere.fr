import React from "react";
import { getCategoryList } from "@emilecalixte/ffa-categories";
import type { CustomRunnerCategory } from "@live24hisere/core/types";

/**
 * @param date The date for which categories should be retrieved
 * @param customRunnerCategories Optionnal additional categories
 * @returns A record with all existing at given date, an additional categories if given, with category codes as keys and category name as values
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
