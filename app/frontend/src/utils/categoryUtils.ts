import { type CategoriesDict, type CategoryShortCode } from "../types/Category";
import { type SelectOption } from "../types/Forms";

export function getCategoriesDictSelectOptions<T extends CategoriesDict>(
    categoriesDict: T | null,
    label?: (code: CategoryShortCode, name: string) => string,
): SelectOption[] {
    if (!categoriesDict) {
        return [];
    }

    return Object.entries(categoriesDict).map(([key, name]) => ({
        label: label ? label(key, name) : name,
        value: key,
    }));
}
