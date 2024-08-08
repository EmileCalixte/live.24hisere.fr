import { SortDirection } from "../constants/sort";

export function getOppositeSortDirection(
    sortDirection: SortDirection,
): SortDirection {
    if (sortDirection === SortDirection.ASC) {
        return SortDirection.DESC;
    }

    return SortDirection.ASC;
}
