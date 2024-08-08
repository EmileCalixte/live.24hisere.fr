/**
 * Returns a copy of an object without the specified keys
 * @param object The object to copy
 * @param keys The keys to exclude
 */
export function excludeKeys<T extends object, K extends keyof T>(
    object: T,
    keys: K[],
): Omit<T, K> {
    const result = { ...object };

    for (const key of keys) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete result[key];
    }

    return result;
}

/**
 * Returns a copy of an object with only the specified keys
 * @param object The object to copy
 * @param keys The keys to include
 */
export function pickKeys<T extends object, K extends keyof T>(
    object: T,
    keys: K[],
): Pick<T, K> {
    const result: Partial<Pick<T, K>> = {};

    for (const key of keys) {
        result[key] = object[key];
    }

    return result as Pick<T, K>;
}

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
export function isDefined<T = unknown>(
    value: T | null,
): value is NonNullable<T> | null {
    return value !== undefined;
}
