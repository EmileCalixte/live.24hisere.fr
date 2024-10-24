/**
 * A category code
 *
 * See https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=25 for list of existing codes
 */
export type CategoryShortCode = string;

/**
 * An object representing an FFA category
 */
export interface Category {
    /**
     * The short code of the category
     */
    code: CategoryShortCode;

    /**
     * The name of the category
     */
    name: string;
}

/**
 * An object whose key is a category short code and value is the corresponding name
 */
export type CategoriesDict = Record<CategoryShortCode, string>;
