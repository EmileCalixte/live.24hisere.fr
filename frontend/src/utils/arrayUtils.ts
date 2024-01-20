export default function inArray<T>(item: T | null | undefined, array: T[]): item is T {
    if (item === null || item === undefined) {
        return false;
    }

    return array.includes(item);
}
