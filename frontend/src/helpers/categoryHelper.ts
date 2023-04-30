export function getCategoriesDictSelectOptions<T extends CategoriesDict>(
    categoriesDict: T | false,
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
