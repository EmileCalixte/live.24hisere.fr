/**
 * Returns a  copy of an object without the specified keys
 * @param object
 * @param keys
 * @returns
 */
export function excludeKeys<T, K extends keyof T>(object: T, keys: K[]): Omit<T, K> {
    const result = {...object};

    for (const key of keys) {
        delete result[key];
    }

    return result;
}
