import React from "react";
import { type PublicRace } from "@live24hisere/core/types";
import { SearchParam } from "../../constants/searchParams";
import { useQueryString } from "./useQueryString";

interface UseRaceQueryString<TRace extends PublicRace> {
    selectedRace: TRace | null;
    setRaceParam: (raceId: number | string) => void;
}

export function useRaceQueryString<TRace extends PublicRace>(
    races: TRace[] | undefined,
): UseRaceQueryString<TRace> {
    const { searchParams, setParams, deleteParams } = useQueryString();

    const searchParamsRace = searchParams.get(SearchParam.RACE);

    const selectedRace = React.useMemo<TRace | null>(() => {
        if (searchParamsRace === null) {
            return null;
        }

        return (
            races?.find((race) => race.id.toString() === searchParamsRace) ??
            null
        );
    }, [races, searchParamsRace]);

    const setRaceParam = React.useCallback(
        (raceId: number | string) => {
            setParams({ [SearchParam.RACE]: raceId.toString() });
        },
        [setParams],
    );

    React.useEffect(() => {
        if (races && searchParamsRace !== null && !selectedRace) {
            deleteParams(SearchParam.RACE, { replace: true });
        }
    }, [deleteParams, races, searchParamsRace, selectedRace]);

    return {
        selectedRace,
        setRaceParam,
    };
}
