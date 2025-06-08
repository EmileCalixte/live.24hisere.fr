import { getCategory } from "@emilecalixte/ffa-categories";
import type { CustomRunnerCategory, RaceRunner } from "@live24hisere/core/types";
import { objectUtils, typeUtils } from "@live24hisere/utils";
import type { SelectOption } from "../types/Forms";

export function getCategoriesSelectOptions(
  categories: Record<string, string> | null,
  label?: (code: string, name: string) => string,
): Array<SelectOption<string>> {
  if (!categories) {
    return [];
  }

  return objectUtils.entries(categories).map(([key, name]) => ({
    label: label ? label(key, name) : name,
    value: key,
  }));
}

export function getRunnerCategory(
  runner: RaceRunner,
  date: Date,
  customCategories: CustomRunnerCategory[],
): { code: string; name: string } {
  const customCategoryId = runner.customCategoryId;

  if (!typeUtils.isNullOrUndefined(customCategoryId)) {
    const customCategory = customCategories.find((customCategory) => customCategory.id === customCategoryId);

    if (customCategory) {
      return customCategory;
    }
  }

  return getCategory(Number(runner.birthYear), { date });
}
