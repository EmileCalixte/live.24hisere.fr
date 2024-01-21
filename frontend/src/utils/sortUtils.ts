import { SortDirection } from "../types/Sort";

export function getOppositeSortDirection(sortDirection: SortDirection): SortDirection {
    if (sortDirection === SortDirection.ASC) {
        return SortDirection.DESC;
    }

    return SortDirection.ASC;
}
