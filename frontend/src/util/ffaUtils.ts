import {type CategoriesDict} from "../types/Category";

/**
 * Returns the category code from a birth year (valid until August 31st, 2023)
 * @see https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=25
 * @param {number} birthYear
 */
export function getCategoryCodeFromBirthYear(birthYear: number): string {
    if (birthYear >= 2017) {
        return "BB";
    }

    if (birthYear >= 2014) {
        return "EA";
    }

    if (birthYear >= 2012) {
        return "PO";
    }

    if (birthYear >= 2010) {
        return "BE";
    }

    if (birthYear >= 2008) {
        return "MI";
    }

    if (birthYear >= 2006) {
        return "CA";
    }

    if (birthYear >= 2004) {
        return "JU";
    }

    if (birthYear >= 2001) {
        return "ES";
    }

    if (birthYear >= 1989) {
        return "SE";
    }

    if (birthYear >= 1984) {
        return "M0";
    }

    if (birthYear >= 1979) {
        return "M1";
    }

    if (birthYear >= 1974) {
        return "M2";
    }

    if (birthYear >= 1969) {
        return "M3";
    }

    if (birthYear >= 1964) {
        return "M4";
    }

    if (birthYear >= 1959) {
        return "M5";
    }

    if (birthYear >= 1954) {
        return "M6";
    }

    if (birthYear >= 1949) {
        return "M7";
    }

    if (birthYear >= 1944) {
        return "M8";
    }

    if (birthYear >= 1939) {
        return "M9";
    }

    return "M10";
}

/**
 * List of existing FFA categories (see https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=25)
 */
export const existingCategories: CategoriesDict = {
    BB: "Baby Athlé",
    EA: "École d'Athlétisme",
    PO: "Poussins",
    BE: "Benjamins",
    MI: "Minimes",
    CA: "Cadets",
    JU: "Juniors",
    ES: "Espoirs",
    SE: "Seniors",
    VE: "Masters",
    M0: "Masters 0",
    M1: "Masters 1",
    M2: "Masters 2",
    M3: "Masters 3",
    M4: "Masters 4",
    M5: "Masters 5",
    M6: "Masters 6",
    M7: "Masters 7",
    M8: "Masters 8",
    M9: "Masters 9",
    M10: "Masters 10",
};

export function getCategoryNameFromCategoryCode(categoryCode: string): string {
    if (categoryCode in existingCategories) {
        return existingCategories[categoryCode];
    }

    return categoryCode;
}

export function getCategoryNameFromBirthYear(birthYear: number): string {
    return getCategoryNameFromCategoryCode(getCategoryCodeFromBirthYear(birthYear));
}
