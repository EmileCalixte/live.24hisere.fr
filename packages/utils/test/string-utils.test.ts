import { describe, expect, it } from "vitest";
import { capitalizeWords, harmonizeName, isValidUrl, latinize } from "../src/string-utils";

describe("Capitalize words", () => {
  it("should capitalize a simple sentence", () => {
    expect(capitalizeWords("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")).toEqual(
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
    );
  });

  it("should capitalize an uppercase sentence", () => {
    expect(capitalizeWords("LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.")).toEqual(
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
    );
  });

  it("should capitalize an sentence with custom separator", () => {
    expect(capitalizeWords("lorem.ipsum.dolor.sit.amet, consectetur.adipiscing.elit.", ["."])).toEqual(
      "Lorem.Ipsum.Dolor.Sit.Amet, consectetur.Adipiscing.Elit.",
    );

    expect(capitalizeWords("lorem.ipsum-dolor.sit-amet, consectetur.adipiscing-elit.", [".", "-"])).toEqual(
      "Lorem.Ipsum-Dolor.Sit-Amet, consectetur.Adipiscing-Elit.",
    );
  });
});

describe("Harmonize name", () => {
  it("should harmonize names", () => {
    expect(harmonizeName("john doe")).toEqual("John Doe");
    expect(harmonizeName("jean-michel  martin")).toEqual("Jean-Michel Martin");
  });
});

describe("Is valid URL", () => {
  it("should check if an URL is valid", () => {
    expect(isValidUrl("http://example.com")).toEqual(true);
    expect(isValidUrl("https://example.com")).toEqual(true);
    expect(isValidUrl("smtp://subdomain.example.com")).toEqual(true);
    expect(isValidUrl("http://example.com:8000")).toEqual(true);
    expect(isValidUrl("http://example")).toEqual(true);

    expect(isValidUrl("http://example.com:80000")).toEqual(false);
    expect(isValidUrl("example.com")).toEqual(false);
    expect(isValidUrl("random string obviously not an URL")).toEqual(false);
  });
});

describe("Latinize", () => {
  it("should remove accents from a string", () => {
    expect(latinize("éèêëàáâäçñ")).toBe("eeeeaaaacn");
  });

  it("should return the same string if no accents are present", () => {
    expect(latinize("Hello World")).toBe("Hello World");
  });

  it("should convert to lowercase if lowerCase is true", () => {
    expect(latinize("École", true)).toBe("ecole");
    expect(latinize("Valérie", true)).toBe("valerie");
  });

  it("should handle empty strings correctly", () => {
    expect(latinize("")).toBe("");
  });

  it("should handle strings with only diacritics", () => {
    expect(latinize("́̀̈̃")) // Only diacritic marks
      .toBe("");
  });

  it("should not remove non-accented special characters", () => {
    expect(latinize("Hello! @Test#")).toBe("Hello! @Test#");
  });
});
