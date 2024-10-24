export function inArray<TItem, TElement extends TItem = TItem>(
    item: TItem | null | undefined,
    array: readonly TElement[],
): item is TElement {
    if (item === null || item === undefined) {
        return false;
    }

    return array.includes(item as TElement);
}
