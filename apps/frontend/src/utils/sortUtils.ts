import { arrayUtils } from "@live24hisere/utils";
import { type SortColumn, SortDirection } from "../constants/sort";

export function isValidSortColumn<T extends readonly SortColumn[]>(
  sortColumn: string | null,
  availableColumns: T,
): sortColumn is T[number] {
  return arrayUtils.inArray(sortColumn, availableColumns);
}

export function isValidSortDirection(value: string): value is SortDirection {
  return arrayUtils.inArray(value, [SortDirection.ASC, SortDirection.DESC]);
}

export function getOppositeSortDirection(sortDirection: SortDirection): SortDirection {
  if (sortDirection === SortDirection.ASC) {
    return SortDirection.DESC;
  }

  return SortDirection.ASC;
}
