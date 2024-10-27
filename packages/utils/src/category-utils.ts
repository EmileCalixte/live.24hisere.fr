import { ALL_CATEGORIES } from "@live24hisere/core/constants";
import { type CategoryShortCode } from "@live24hisere/core/types";

/**
 * Returns the category code from a birth year (valid until August 31st, 2025)
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

    if (birthYear >= 2019) {
        return "BB";
    }

    if (birthYear >= 2016) {
        return "EA";
    }

    if (birthYear >= 2014) {
        return "PO";
    }

    if (birthYear >= 2012) {
        return "BE";
    }

    if (birthYear >= 2010) {
        return "MI";
    }

    if (birthYear >= 2008) {
        return "CA";
    }

    if (birthYear >= 2006) {
        return "JU";
    }

    if (birthYear >= 2003) {
        return "ES";
    }

    if (birthYear >= 1991) {
        return "SE";
    }

    if (birthYear >= 1986) {
        return "M0";
    }

    if (birthYear >= 1981) {
        return "M1";
    }

    if (birthYear >= 1976) {
        return "M2";
    }

    if (birthYear >= 1971) {
        return "M3";
    }

    if (birthYear >= 1966) {
        return "M4";
    }

    if (birthYear >= 1961) {
        return "M5";
    }

    if (birthYear >= 1956) {
        return "M6";
    }

    if (birthYear >= 1951) {
        return "M7";
    }

    if (birthYear >= 1946) {
        return "M8";
    }

    if (birthYear >= 1941) {
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
