import { type CategoryCode, type CategoryList, type CategoryName } from "@emilecalixte/ffa-categories";
import { objectUtils } from "@live24hisere/utils";
import { type SelectOption } from "../types/Forms";

export function getCategoriesDictSelectOptions(
  categoriesDict: CategoryList | null,
  label?: (code: CategoryCode, name: CategoryName) => string,
): Array<SelectOption<CategoryCode>> {
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
