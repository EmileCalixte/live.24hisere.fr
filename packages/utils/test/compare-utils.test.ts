import { describe, expect, it } from "vitest";
import { spaceship } from "../src/compare-utils";

describe("Spaceship", () => {
  it("Should return 0 if both values are null or undefined", () => {
    expect(spaceship(null, null)).toBe(0);
    expect(spaceship(undefined, null)).toBe(0);
    expect(spaceship(null, undefined)).toBe(0);
    expect(spaceship(undefined, undefined)).toBe(0);
  });

  it("Should return -1 if first value is null or undefined", () => {
    expect(spaceship(null, Number.MIN_SAFE_INTEGER)).toBe(-1);
    expect(spaceship(undefined, Number.MIN_SAFE_INTEGER)).toBe(-1);
  });

  it("Should return 1 if second value is null or undefined", () => {
    expect(spaceship(Number.MIN_SAFE_INTEGER, null)).toBe(1);
    expect(spaceship(Number.MIN_SAFE_INTEGER, undefined)).toBe(1);
  });

  it("Should return 1 if first value is greater than second value", () => {
    expect(spaceship(7, 4)).toBe(1);
  });

  it("Should return -1 if second value is greater than first value", () => {
    expect(spaceship(-2, 12)).toBe(-1);
  });
});
