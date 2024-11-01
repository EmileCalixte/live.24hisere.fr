import { describe, expect, it } from "vitest";
import { range } from "../src/number-utils";

describe("Range", () => {
  it("Should generate ascending ranges", () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(range(2, 4)).toEqual([2, 3, 4]);
    expect(range(1.7, 4.7)).toEqual([1.7, 2.7, 3.7, 4.7]);
    expect(range(1.7, 4)).toEqual([1.7, 2.7, 3.7]);
    expect(range(-1, 2)).toEqual([-1, 0, 1, 2]);
    expect(range(3, 6, 2)).toEqual([3, 5]);
    expect(range(3, 7, 2)).toEqual([3, 5, 7]);
  });

  it("Should generate descending ranges", () => {
    expect(range(5, 2)).toEqual([5, 4, 3, 2]);
    expect(range(2, -2)).toEqual([2, 1, 0, -1, -2]);
  });

  it("Should generate and empty array if bounds are equal", () => {
    expect(range(0, 0)).toEqual([]);
    expect(range(-4, -4)).toEqual([]);
    expect(range(2, 2)).toEqual([]);
  });

  it("Should throw if step is not positive integer", () => {
    const error = "Step must be a must be a positive non-null integer";

    expect(() => range(1, 5, 0)).toThrowError(error);
    expect(() => range(1, 5, -1)).toThrowError(error);
    expect(() => range(0, 0, 0)).toThrowError(error);
    expect(() => range(0, 0, 0.5)).toThrowError(error);
    expect(() => range(0, 0, -2.3)).toThrowError(error);
  });
});
