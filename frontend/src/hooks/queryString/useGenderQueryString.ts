import React from "react";
import { SearchParam } from "../../constants/searchParams";
import type { GenderWithMixed } from "../../types/Gender";
import { useQueryString } from "./useQueryString";
import { isValidGender } from "../../utils/genderUtils";

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

    const setGenderParam = React.useCallback((gender: string) => {
        setParams({ [SearchParam.GENDER]: gender });
    }, [setParams]);

    const deleteGenderParam = React.useCallback(() => {
        deleteParams(SearchParam.GENDER);
    }, [deleteParams]);

    React.useEffect(() => {
        if (!isValidGender(selectedGender)) {
            deleteGenderParam();
        }
    });

    return {
        selectedGender,
        setGenderParam,
        deleteGenderParam,
    };
}
