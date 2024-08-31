import React from "react";
import { type Race } from "@live24hisere/types";
import { SearchParam } from "../../constants/searchParams";
import { useQueryString } from "./useQueryString";

interface UseRaceQueryString<TRace extends Race> {
    selectedRace: TRace | null;
    setRaceParam: (raceId: number | string) => void;
}

export function useRaceQueryString<TRace extends Race>(
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
