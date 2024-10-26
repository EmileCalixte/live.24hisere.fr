import React from "react";
import { type NavigateOptions } from "react-router-dom";
import { type PublicRace } from "@live24hisere/core/types";
import { RankingTimeMode } from "../../constants/rankingTimeMode";
import { SearchParam } from "../../constants/searchParams";
import { type ReactStateSetter } from "../../types/utils/react";
import { getDateFromRaceTime } from "../../utils/raceUtils";
import { useQueryString } from "./useQueryString";

interface UseRankingTimeQueryString {
    selectedTimeMode: RankingTimeMode;
    selectedRankingTime: number | null;
    rankingDate: Date | undefined;
    setTimeModeParam: (timeMode: RankingTimeMode) => void;
    deleteTimeModeParam: () => void;
    setRankingTimeParam: (time: number | string) => void;
    deleteRankingTimeParam: () => void;
    setRankingTimeMemory: ReactStateSetter<number | null>;
}

export function useRankingTimeQueryString(
    race: PublicRace | null,
): UseRankingTimeQueryString {
    const { searchParams, setParams, deleteParams } = useQueryString();

    const searchParamsTimeMode = searchParams.get(SearchParam.TIME_MODE);
    const searchParamsRankingTime = searchParams.get(SearchParam.RANKING_TIME);

    // To keep in memory the selected ranking time when the user selects current time ranking mode, in seconds
    const [rankingTimeMemory, setRankingTimeMemory] = React.useState<
        number | null
    >(null);

    const selectedTimeMode = React.useMemo<RankingTimeMode>(() => {
        if (searchParamsTimeMode === RankingTimeMode.AT) {
            return RankingTimeMode.AT;
        }

        return RankingTimeMode.NOW;
    }, [searchParamsTimeMode]);

    // Ranking time in ms
    const selectedRankingTime = React.useMemo<number | null>(() => {
        if (selectedTimeMode !== RankingTimeMode.AT) {
            return null;
        }

        if (searchParamsRankingTime === null) {
            return null;
        }

        const time = parseInt(searchParamsRankingTime);

        if (isNaN(time)) {
            return null;
        }

        return time * 1000;
    }, [searchParamsRankingTime, selectedTimeMode]);

    const rankingDate = React.useMemo<Date | undefined>(() => {
        if (!race) {
            return;
        }

        if (
            selectedTimeMode !== RankingTimeMode.AT ||
            selectedRankingTime === null
        ) {
            return;
        }

        return getDateFromRaceTime(race, selectedRankingTime);
    }, [race, selectedRankingTime, selectedTimeMode]);

    const shouldResetRankingTime = React.useCallback(
        (newRaceDuration: number) => {
            if (rankingTimeMemory === null) {
                return true;
            }

            if (rankingTimeMemory < 0) {
                return true;
            }

            if (race && rankingTimeMemory > newRaceDuration) {
                return true;
            }

            // For better UX, if the user looks at the current time rankings, we want to reset the time inputs to the
            // duration of the newly selected race
            return selectedTimeMode === RankingTimeMode.NOW;
        },
        [rankingTimeMemory, race, selectedTimeMode],
    );

    const setTimeModeParam = React.useCallback(
        (timeMode: RankingTimeMode) => {
            setParams({ [SearchParam.TIME_MODE]: timeMode });
        },
        [setParams],
    );

    const deleteTimeModeParam = React.useCallback(() => {
        deleteParams(SearchParam.TIME_MODE);
    }, [deleteParams]);

    const setRankingTimeParam = React.useCallback(
        (time: number | string, navigateOpts?: NavigateOptions) => {
            setParams(
                { [SearchParam.RANKING_TIME]: time.toString() },
                navigateOpts,
            );
        },
        [setParams],
    );

    const deleteRankingTimeParam = React.useCallback(
        (navigateOpts?: NavigateOptions) => {
            deleteParams(SearchParam.RANKING_TIME, navigateOpts);
        },
        [deleteParams],
    );

    React.useEffect(() => {
        if (!race) {
            return;
        }

        if (shouldResetRankingTime(race.duration)) {
            setRankingTimeMemory(race.duration);
            if (selectedTimeMode === RankingTimeMode.AT) {
                setRankingTimeParam(race.duration, { replace: true });
            }
        }
        // We want to run this effect only when race changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [race]);

    React.useEffect(() => {
        if (!race) {
            return;
        }

        if (
            selectedTimeMode === RankingTimeMode.AT &&
            !searchParams.has(SearchParam.RANKING_TIME)
        ) {
            setRankingTimeParam(rankingTimeMemory ?? race.duration, {
                replace: true,
            });
        }
    }, [
        race,
        rankingTimeMemory,
        searchParams,
        selectedTimeMode,
        setRankingTimeParam,
    ]);

    React.useEffect(() => {
        if (
            selectedTimeMode !== RankingTimeMode.AT &&
            searchParams.has(SearchParam.RANKING_TIME)
        ) {
            deleteRankingTimeParam({ replace: true });
        }
    }, [deleteRankingTimeParam, searchParams, selectedTimeMode]);

    React.useEffect(() => {
        if (
            selectedTimeMode !== RankingTimeMode.AT ||
            !race ||
            selectedRankingTime === null
        ) {
            return;
        }

        if (selectedRankingTime > race.duration * 1000) {
            setRankingTimeParam(race.duration, { replace: true });
            setRankingTimeMemory(race.duration);
        }
    }, [race, selectedRankingTime, selectedTimeMode, setRankingTimeParam]);

    return {
        selectedTimeMode,
        selectedRankingTime,
        rankingDate,
        setTimeModeParam,
        deleteTimeModeParam,
        setRankingTimeParam,
        deleteRankingTimeParam,
        setRankingTimeMemory,
    };
}
