import React from "react";
import { type NavigateOptions } from "react-router-dom";
import { SearchParam } from "../../constants/searchParams";
import {
    type CategoriesDict,
    type CategoryShortCode,
} from "../../types/Category";
import { type Race } from "../../types/Race";
import { useQueryString } from "./useQueryString";

interface UseCategoryQueryString {
    selectedCategory: CategoryShortCode | null;
    setCategoryParam: (categoryCode: string) => void;
    deleteCategoryParam: () => void;
}

export function useCategoryQueryString(
    race: Race | null,
    categories: CategoriesDict | null,
): UseCategoryQueryString {
    const { searchParams, setParams, deleteParams } = useQueryString();

    const searchParamsCategory = searchParams.get(SearchParam.CATEGORY);

    const selectedCategory = React.useMemo<CategoryShortCode | null>(() => {
        if (!race || !categories) {
            return null;
        }

        return (
            Object.keys(categories).find(
                (categoryCode) => categoryCode === searchParamsCategory,
            ) ?? null
        );
    }, [categories, searchParamsCategory, race]);

    const setCategoryParam = React.useCallback(
        (categoryCode: string) => {
            setParams({ [SearchParam.CATEGORY]: categoryCode });
        },
        [setParams],
    );

    const deleteCategoryParam = React.useCallback(
        (navigateOpts?: NavigateOptions) => {
            deleteParams(SearchParam.CATEGORY, navigateOpts);
        },
        [deleteParams],
    );

    React.useEffect(() => {
        if (categories && searchParamsCategory !== null && !selectedCategory) {
            deleteCategoryParam({ replace: true });
        }
    }, [
        categories,
        deleteCategoryParam,
        searchParamsCategory,
        selectedCategory,
    ]);

    return {
        selectedCategory,
        setCategoryParam,
        deleteCategoryParam,
    };
}
