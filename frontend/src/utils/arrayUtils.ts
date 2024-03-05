export function inArray<T, S extends T = T>(item: T | null | undefined, array: S[]): item is S {
    if (item === null || item === undefined) {
        return false;
    }

    return array.includes(item as S);
}
