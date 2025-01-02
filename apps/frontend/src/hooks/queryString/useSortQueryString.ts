import { useQueryState } from "nuqs";
import { SearchParam } from "../../constants/searchParams";
import { type SortColumn, SortDirection } from "../../constants/sort";
import { parseAsEnum } from "../../queryStringParsers/parseAsEnum";

interface UseSortQueryString<T extends readonly SortColumn[]> {
  sortColumn: T[number];
  sortDirection: SortDirection;
  setSortColumn: (sortColumn: T[number]) => Promise<URLSearchParams>;
  setSortDirection: (sortDirection: SortDirection) => Promise<URLSearchParams>;
}

export function useSortQueryString<T extends readonly SortColumn[]>(
  availableColumns: T,
  defaultColumn: T[number],
): UseSortQueryString<T> {
  const [sortColumn, setSortColumn] = useQueryState(
    SearchParam.SORT_COLUMN,
    parseAsEnum<T>(availableColumns).withDefault(defaultColumn),
  );

  const [sortDirection, setSortDirection] = useQueryState(
    SearchParam.SORT_DIRECTION,
    parseAsEnum([SortDirection.ASC, SortDirection.DESC]).withDefault(SortDirection.ASC),
  );

  return {
    sortColumn,
    sortDirection,
    setSortColumn,
    setSortDirection,
  };
}
