/**
 * An object representing an FFA category
 */
type Category = {
    /**
     * The short code of the category
     */
    code: string;

    /**
     * The name of the category
     */
    name: string;
}

/**
 * An object whose key is a category short code and value is the corresponding name
 */
export type CategoriesDict = Record<string, string>;

export default Category;
