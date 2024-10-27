import { ALL_CATEGORIES } from "@live24hisere/core/constants";
import { type CategoryShortCode } from "@live24hisere/core/types";

/**
 * Returns the category code from a birth year (valid until August 31st, 2024)
 * @see https://www.athle.fr/asp.net/main.html/html.aspx?htmlid=25
 */
export function getCategoryCodeFromBirthYear(
    birthYear: number | string,
): CategoryShortCode {
    if (typeof birthYear === "string") {
        birthYear = Number(birthYear);

        if (isNaN(birthYear)) {
            throw new Error("birthYear is not a valid number");
        }
    }

    if (birthYear >= 2018) {
        return "BB";
    }

    if (birthYear >= 2015) {
        return "EA";
    }

    if (birthYear >= 2013) {
        return "PO";
    }

    if (birthYear >= 2011) {
        return "BE";
    }

    if (birthYear >= 2009) {
        return "MI";
    }

    if (birthYear >= 2007) {
        return "CA";
    }

    if (birthYear >= 2005) {
        return "JU";
    }

    if (birthYear >= 2002) {
        return "ES";
    }

    if (birthYear >= 1990) {
        return "SE";
    }

    if (birthYear >= 1985) {
        return "M0";
    }

    if (birthYear >= 1980) {
        return "M1";
    }

    if (birthYear >= 1975) {
        return "M2";
    }

    if (birthYear >= 1970) {
        return "M3";
    }

    if (birthYear >= 1965) {
        return "M4";
    }

    if (birthYear >= 1960) {
        return "M5";
    }

    if (birthYear >= 1955) {
        return "M6";
    }

    if (birthYear >= 1950) {
        return "M7";
    }

    if (birthYear >= 1945) {
        return "M8";
    }

    if (birthYear >= 1940) {
        return "M9";
    }

    return "M10";
}

export function isCategoryCode(value: string): value is CategoryShortCode {
    return value in ALL_CATEGORIES;
}

export function getCategoryNameFromCategoryCode(categoryCode: string): string {
    if (isCategoryCode(categoryCode)) {
        return ALL_CATEGORIES[categoryCode];
    }

    return categoryCode;
}

export function getCategoryNameFromBirthYear(
    birthYear: number | string,
): string {
    return getCategoryNameFromCategoryCode(
        getCategoryCodeFromBirthYear(birthYear),
    );
}
