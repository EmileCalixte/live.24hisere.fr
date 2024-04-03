import React from "react";
import { SearchParam } from "../../constants/searchParams";
import { type Race } from "../../types/Race";
import { useQueryString } from "./useQueryString";

interface UseRaceQueryString<T extends Race> {
    selectedRace: T | null;
    setRaceParam: (raceId: number | string) => void;
}

export function useRaceQueryString<T extends Race>(races: T[] | undefined): UseRaceQueryString<T> {
    const { searchParams, setParams, deleteParams } = useQueryString();

    const searchParamsRace = searchParams.get(SearchParam.RACE);

    const selectedRace = React.useMemo<T | null>(() => {
        if (searchParamsRace === null) {
            return null;
        }

        return races?.find(race => race.id.toString() === searchParamsRace) ?? null;
    }, [races, searchParamsRace]);

    const setRaceParam = React.useCallback((raceId: number | string) => {
        setParams({ [SearchParam.RACE]: raceId.toString() });
    }, [setParams]);

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
