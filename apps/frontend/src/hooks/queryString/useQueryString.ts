import React from "react";
import {
    type NavigateOptions,
    type SetURLSearchParams,
    type URLSearchParamsInit,
    useSearchParams,
} from "react-router-dom";

interface UseQueryString {
    searchParams: URLSearchParams;
    setSearchParams: SetURLSearchParams;

    /**
     * The query string
     */
    queryString: string;

    /**
     * The query string with a "?" prefix
     */
    prefixedQueryString: string;

    /**
     * Updates the value of specified parameters
     * @param toSet The params to update
     */
    setParams: (
        toSet: Record<string, string>,
        navigateOpts?: NavigateOptions,
    ) => void;

    /**
     * Deletes the specified parameters
     * @param toDelete The params to delete
     */
    deleteParams: (
        toDelete: string | string[],
        navigateOpts?: NavigateOptions,
    ) => void;
}

export function useQueryString(
    defaultInit?: URLSearchParamsInit,
): UseQueryString {
    const [searchParams, setSearchParams] = useSearchParams(defaultInit);

    const queryString = searchParams.toString();

    const prefixedQueryString = queryString.length ? `?${queryString}` : "";

    const setParams = React.useCallback(
        (toSet: Record<string, string>, navigateOpts?: NavigateOptions) => {
            setSearchParams((params) => {
                for (const [name, value] of Object.entries(toSet)) {
                    params.set(name, value);
                }

                return params;
            }, navigateOpts);
        },
        [setSearchParams],
    );

    const deleteParams = React.useCallback(
        (toDelete: string | string[], navigateOpts?: NavigateOptions) => {
            if (typeof toDelete === "string") {
                toDelete = [toDelete];
            }

            if (
                toDelete.some((paramToDelete) =>
                    searchParams.has(paramToDelete),
                )
            ) {
                setSearchParams((params) => {
                    for (const paramToDelete of toDelete) {
                        params.delete(paramToDelete);
                    }
                    return params;
                }, navigateOpts);
            }
        },
        [searchParams, setSearchParams],
    );

    return {
        searchParams,
        setSearchParams,
        queryString,
        prefixedQueryString,
        setParams,
        deleteParams,
    };
}
