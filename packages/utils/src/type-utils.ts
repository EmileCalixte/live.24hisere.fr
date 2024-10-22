/**
 * Returns true if value is null or undefined
 * @param value
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}
