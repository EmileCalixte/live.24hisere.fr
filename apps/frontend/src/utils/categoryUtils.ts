import type { CategoryCode, CategoryList, CategoryName } from "@emilecalixte/ffa-categories";
import { objectUtils } from "@live24hisere/utils";
import type { SelectOption } from "../types/Forms";

export function getCategoriesSelectOptions(
  categories: CategoryList | null,
  label?: (code: CategoryCode, name: CategoryName) => string,
): Array<SelectOption<CategoryCode>> {
  if (!categories) {
    return [];
  }

  return objectUtils.entries(categories).map(([key, name]) => ({
    label: label ? label(key, name) : name,
    value: key,
  }));
}
