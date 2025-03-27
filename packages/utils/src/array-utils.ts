export function inArray<TItem, TElement extends TItem = TItem>(
  item: TItem | null | undefined,
  array: readonly TElement[],
): item is TElement {
  if (item === null || item === undefined) {
    return false;
  }

  return array.includes(item as TElement);
}

export function chunk<TArray extends readonly unknown[]>(array: TArray, chunkSize: number): TArray[] {
  if (array.length <= chunkSize) {
    return [array];
  }

  const chunks: TArray[] = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize) as unknown as TArray);
  }

  return chunks;
}
