import React from "react";
import { SearchParam } from "../../constants/searchParams";
import { type SortBy, SortDirection } from "../../constants/sort";
import { inArray } from "../../utils/arrayUtils";
import { useQueryString } from "./useQueryString";

interface UseSortQueryString<T extends SortBy[]> {
    sortColumn: T[number];
    sortDirection: SortDirection;
    setSortColumnParam: (sortColumn: T[number]) => void;
    setSortDirectionParam: (sortDirection: SortDirection) => void;
}

function isValidSortColumn<T extends SortBy[]>(sortColumn: string | null, availableColumns: T): sortColumn is T[number] {
    return inArray(sortColumn, availableColumns);
}

function isValidSortDirection(sortDirection: string | null): sortDirection is SortDirection {
    return inArray(sortDirection, [SortDirection.ASC, SortDirection.DESC]);
}

export function useSortQueryString<T extends SortBy[]>(availableColumns: T, defaultColumn: T[number]): UseSortQueryString<T> {
    const { searchParams, setParams } = useQueryString();

    const searchParamsSortColumn = searchParams.get(SearchParam.SORT_COLUMN);
    const searchParamsDirection = searchParams.get(SearchParam.SORT_DIRECTION);

    React.useEffect(() => {
        const newParams: Record<string, string> = {};

        if (!isValidSortColumn(searchParamsSortColumn, availableColumns)) {
            newParams[SearchParam.SORT_COLUMN] = defaultColumn;
        }

        if (!isValidSortDirection(searchParamsDirection)) {
            newParams[SearchParam.SORT_DIRECTION] = SortDirection.ASC;
        }

        setParams(newParams);
    }, [availableColumns, defaultColumn, searchParamsDirection, searchParamsSortColumn, setParams]);

    const sortColumn = React.useMemo<T[number]>(() => {
        return isValidSortColumn(searchParamsSortColumn, availableColumns) ? searchParamsSortColumn : defaultColumn;
    }, [availableColumns, defaultColumn, searchParamsSortColumn]);

    const sortDirection = React.useMemo<SortDirection>(() => {
        return isValidSortDirection(searchParamsDirection) ? searchParamsDirection : SortDirection.ASC;
    }, [searchParamsDirection]);

    const setSortColumnParam = React.useCallback((sortColumn: T[number]) => {
        setParams({ [SearchParam.SORT_COLUMN]: sortColumn });
    }, [setParams]);

    const setSortDirectionParam = React.useCallback((sortDirection: SortDirection) => {
        setParams({ [SearchParam.SORT_DIRECTION]: sortDirection });
    }, [setParams]);

    return {
        sortColumn,
        sortDirection,
        setSortColumnParam,
        setSortDirectionParam,
    };
}
