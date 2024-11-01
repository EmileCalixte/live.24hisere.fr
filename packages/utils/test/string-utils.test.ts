import { describe, expect, it } from "vitest";
import { capitalizeWords, harmonizeName, isValidUrl } from "../src/string-utils";

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
