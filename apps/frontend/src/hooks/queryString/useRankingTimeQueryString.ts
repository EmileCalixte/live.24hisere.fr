import React from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import type { PublicRace } from "@live24hisere/core/types";
import { RankingTimeMode } from "../../constants/rankingTimeMode";
import { SearchParam } from "../../constants/searchParams";
import { parseAsEnum } from "../../queryStringParsers/parseAsEnum";
import type { ReactStateSetter } from "../../types/utils/react";
import { getDateFromRaceTime } from "../../utils/raceUtils";

interface UseRankingTimeQueryString {
  selectedTimeMode: RankingTimeMode;
  setSelectedTimeMode: (timeMode: RankingTimeMode | null) => Promise<URLSearchParams>;
  selectedRankingTime: number | null;
  rankingDate: Date | undefined;
  setRankingTime: (time: number | null) => Promise<URLSearchParams>;
  setRankingTimeMemory: ReactStateSetter<number | null>;
}

export function useRankingTimeQueryString(race: PublicRace | null): UseRankingTimeQueryString {
  const [selectedTimeMode, setSelectedTimeMode] = useQueryState(
    SearchParam.TIME_MODE,
    parseAsEnum([RankingTimeMode.AT, RankingTimeMode.NOW]).withDefault(RankingTimeMode.NOW),
  );
  const [rankingTime, setRankingTime] = useQueryState(SearchParam.RANKING_TIME, parseAsInteger);

  // To keep in memory the selected ranking time when the user selects current time ranking mode, in seconds
  const [rankingTimeMemory, setRankingTimeMemory] = React.useState<number | null>(null);

  // Ranking time in ms
  const selectedRankingTime = React.useMemo<number | null>(() => {
    if (selectedTimeMode !== RankingTimeMode.AT) {
      return null;
    }

    if (rankingTime === null) {
      return null;
    }

    return rankingTime * 1000;
  }, [rankingTime, selectedTimeMode]);

  const rankingDate = React.useMemo<Date | undefined>(() => {
    if (!race) {
      return;
    }

    if (selectedTimeMode !== RankingTimeMode.AT || selectedRankingTime === null) {
      return;
    }

    return getDateFromRaceTime(race, selectedRankingTime);
  }, [race, selectedRankingTime, selectedTimeMode]);

  const shouldResetRankingTime = React.useCallback(
    (newRaceDuration: number) => {
      if (rankingTimeMemory === null) {
        return false;
      }

      if (rankingTimeMemory < 0) {
        return true;
      }

      if (race && rankingTimeMemory > newRaceDuration) {
        return true;
      }

      // For better UX, if the user looks at the current time rankings, we want to reset the time inputs to the
      // duration of the newly selected race
      return selectedTimeMode !== RankingTimeMode.AT;
    },
    [rankingTimeMemory, race, selectedTimeMode],
  );

  React.useEffect(() => {
    if (!race) {
      return;
    }

    if (shouldResetRankingTime(race.duration)) {
      setRankingTimeMemory(race.duration);
      if (selectedTimeMode === RankingTimeMode.AT) {
        void setRankingTime(race.duration);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We want to run this effect only when race changes
  }, [race]);

  React.useEffect(() => {
    if (!race) {
      return;
    }

    if (selectedTimeMode === RankingTimeMode.AT && rankingTime === null) {
      void setRankingTime(rankingTimeMemory ?? race.duration);
    }
  }, [race, rankingTime, rankingTimeMemory, selectedTimeMode, setRankingTime]);

  React.useEffect(() => {
    if (selectedTimeMode !== RankingTimeMode.AT) {
      void setRankingTime(null);
    }
  }, [selectedTimeMode, setRankingTime]);

  React.useEffect(() => {
    if (selectedTimeMode !== RankingTimeMode.AT || !race || selectedRankingTime === null) {
      return;
    }

    if (selectedRankingTime > race.duration * 1000) {
      void setRankingTime(race.duration);
      setRankingTimeMemory(race.duration);
    }
  }, [race, selectedRankingTime, selectedTimeMode, setRankingTime]);

  return {
    selectedTimeMode,
    setSelectedTimeMode,
    selectedRankingTime,
    rankingDate,
    setRankingTime,
    setRankingTimeMemory,
  };
}
