/**
 * Returns true if value is null or undefined
 * @param value
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Returns true if a value is not undefined
 * @param value
 */
export function isDefined<T = unknown>(value: T | null): value is NonNullable<T> | null {
  return value !== undefined;
}

export function booleanToString(value: boolean): "0" | "1" {
  return value ? "1" : "0";
}

export function stringToBoolean(value: string): boolean {
  return value !== "" && value !== "0";
}
