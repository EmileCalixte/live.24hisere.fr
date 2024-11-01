import { type CategoryFullName, type CategoryShortCode, type PartialCategoriesDict } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { type SelectOption } from "../types/Forms";

export function getCategoriesDictSelectOptions(
  categoriesDict: PartialCategoriesDict | null,
  label?: (code: CategoryShortCode, name: CategoryFullName) => string,
): Array<SelectOption<CategoryShortCode>> {
  if (!categoriesDict) {
    return [];
  }

  return objectUtils.entries(categoriesDict).map(([key, name]) => {
    return {
      label: label ? label(key, name) : name,
      value: key,
    };
  });
}
