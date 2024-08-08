import React from "react";
import { type NavigateOptions } from "react-router-dom";
import { SearchParam } from "../../constants/searchParams";
import type { GenderWithMixed } from "../../types/Gender";
import { isValidGender } from "../../utils/genderUtils";
import { useQueryString } from "./useQueryString";

interface UseGenderQueryString {
    selectedGender: GenderWithMixed;
    setGenderParam: (gender: string) => void;
    deleteGenderParam: () => void;
}

export function useGenderQueryString(): UseGenderQueryString {
    const { searchParams, setParams, deleteParams } = useQueryString();

    const searchParamsGender = searchParams.get(SearchParam.GENDER);

    const selectedGender = React.useMemo<GenderWithMixed>(() => {
        if (isValidGender(searchParamsGender)) {
            return searchParamsGender;
        }

        return "mixed";
    }, [searchParamsGender]);

    const setGenderParam = React.useCallback(
        (gender: string) => {
            setParams({ [SearchParam.GENDER]: gender });
        },
        [setParams],
    );

    const deleteGenderParam = React.useCallback(
        (navigateOpts?: NavigateOptions) => {
            deleteParams(SearchParam.GENDER, navigateOpts);
        },
        [deleteParams],
    );

    React.useEffect(() => {
        if (!isValidGender(selectedGender)) {
            deleteGenderParam({ replace: true });
        }
    });

    return {
        selectedGender,
        setGenderParam,
        deleteGenderParam,
    };
}
