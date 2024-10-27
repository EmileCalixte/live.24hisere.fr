import { describe, expect, it } from "vitest";
import { getCategoryCodeFromBirthYear } from "../src/category-utils";
import { range } from "../src/number-utils";

describe("Get category code from birth year", () => {
    it("Should return correct category code", () => {
        const expected = [
            [2019, 2025, "BB"],
            [2016, 2018, "EA"],
            [2014, 2015, "PO"],
            [2012, 2013, "BE"],
            [2010, 2011, "MI"],
            [2008, 2009, "CA"],
            [2006, 2007, "JU"],
            [2003, 2005, "ES"],
            [1991, 2002, "SE"],
            [1986, 1990, "M0"],
            [1981, 1985, "M1"],
            [1976, 1980, "M2"],
            [1971, 1975, "M3"],
            [1966, 1970, "M4"],
            [1961, 1965, "M5"],
            [1956, 1960, "M6"],
            [1951, 1955, "M7"],
            [1946, 1950, "M8"],
            [1941, 1945, "M9"],
            [1900, 1940, "M10"],
        ] as const;

        for (const [min, max, expectedCategory] of expected) {
            for (const year of range(min, max)) {
                expect(getCategoryCodeFromBirthYear(year)).toBe(
                    expectedCategory,
                );
            }
        }
    });

    it("Should work with a numeric string birth year", () => {
        expect(getCategoryCodeFromBirthYear("1970")).toBe("M4");
    });

    it("Should throw an error if birth year is not numeric", () => {
        expect(() => getCategoryCodeFromBirthYear("abcd")).toThrow(
            "birthYear is not a valid number",
        );
    });
});
