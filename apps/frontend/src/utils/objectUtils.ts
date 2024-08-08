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
