import { type ALL_CATEGORIES } from "../constants/runners/categories";

/**
 * An object whose key is a category short code and value is the corresponding name, containing all existing categories
 */
export type FullCategoriesDict = typeof ALL_CATEGORIES;

/**
 * An object whose key is a category short code and value is the corresponding name
 */
// export type PartialCategoriesDict = {
// [K in CategoryShortCode]?: FullCategoriesDict[K];
// }
export type PartialCategoriesDict = Partial<FullCategoriesDict>;

/**
 * A category code
 *
 * See https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=25 for list of existing codes
 */
export type CategoryShortCode = keyof FullCategoriesDict;

export type CategoryFullName = FullCategoriesDict[CategoryShortCode];
