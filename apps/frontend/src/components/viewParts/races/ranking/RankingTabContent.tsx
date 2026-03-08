import React from "react";
import { useQueryState } from "nuqs";
import type { GenderWithMixed } from "@live24hisere/core/types";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { RankingTimeMode } from "../../../../constants/rankingTimeMode";
import { SearchParam } from "../../../../constants/searchParams";
import { WINDOW_WIDTH_BREAKPOINTS } from "../../../../constants/ui/sizing";
import { appDataContext } from "../../../../contexts/AppDataContext";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { useAllCategories } from "../../../../hooks/categories/useAllCategories";
import { useRunnerFilteredCategories } from "../../../../hooks/categories/useRunnerFilteredCategories";
import { useRankingTimeQueryString } from "../../../../hooks/queryString/useRankingTimeQueryString";
import { useProcessedRunners } from "../../../../hooks/runners/useProcessedRunners";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import { useRanking } from "../../../../hooks/useRanking";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { parseAsGender } from "../../../../queryStringParsers/parseAsGender";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { isRaceFinished } from "../../../../utils/raceUtils";
import { FormatGapMode } from "../../../../utils/runnerUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import RankingSettings from "./RankingSettings";
import RankingTable from "./RankingTable";
import ResponsiveRankingTable from "./responsive/ResponsiveRankingTable";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = WINDOW_WIDTH_BREAKPOINTS.XL;

export function RankingTabContent(): React.ReactElement {
  const { selectedRace, selectedRaceRunners } = React.useContext(racesViewContext);
  const { serverTimeOffset, customRunnerCategories } = React.useContext(appDataContext);

  const [selectedCategoryCode, setSelectedCategory] = useQueryState(SearchParam.CATEGORY);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

  const getCategory = useGetRunnerCategory();

  const { width: windowWidth } = useWindowDimensions();

  const allCategories = useAllCategories(
    selectedRace ? new Date(selectedRace.startTime) : undefined,
    customRunnerCategories,
  );

  const {
    selectedTimeMode,
    setSelectedTimeMode,
    selectedRankingTime,
    rankingDate,
    setRankingTime,
    setRankingTimeMemory,
  } = useRankingTimeQueryString(selectedRace);

  const processedRunners = useProcessedRunners(selectedRaceRunners, selectedRace, !rankingDate);

  const ranking = useRanking(selectedRace ?? undefined, processedRunners, rankingDate);

  const filteredRanking = React.useMemo(() => {
    if (!ranking || !selectedRace) {
      return null;
    }

    const raceStartDate = new Date(selectedRace.startTime);

    return ranking.filter((runner) => {
      if (selectedCategoryCode && getCategory(runner, raceStartDate).code !== selectedCategoryCode) {
        return false;
      }

      if (selectedGender && runner.gender.toUpperCase() !== selectedGender.toUpperCase()) {
        return false;
      }

      return true;
    });
  }, [getCategory, ranking, selectedCategoryCode, selectedGender, selectedRace]);

  // Defer the display so filter/time-mode changes don't block the UI.
  const deferredFilteredRanking = React.useDeferredValue(filteredRanking);
  const isPending = deferredFilteredRanking !== filteredRanking;

  const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;

    trackEvent(TrackedEvent.CHANGE_RANKING_CATEGORY, { category: value });

    if (value === "scratch") {
      void setSelectedCategory(null);
      return;
    }

    void setSelectedCategory(value);
  };

  const onGenderSelect = (gender: GenderWithMixed): void => {
    trackEvent(TrackedEvent.CHANGE_RANKING_GENDER, { gender });

    if (gender === "mixed") {
      void setSelectedGender(null);
      return;
    }

    void setSelectedGender(gender);
  };

  const onTimeModeSelect = (timeMode: RankingTimeMode): void => {
    trackEvent(TrackedEvent.CHANGE_RANKING_TIME_MODE, { timeMode });

    if (timeMode === RankingTimeMode.NOW) {
      void setSelectedTimeMode(null);
      void setRankingTime(null);
      return;
    }

    void setSelectedTimeMode(timeMode);
  };

  /**
   * @param time The new ranking time from race start in ms
   */
  const onRankingTimeSave = (time: number): void => {
    trackEvent(TrackedEvent.CHANGE_RANKING_TIME, { time });

    const timeToSave = Math.floor(time / 1000);

    void setRankingTime(timeToSave);
    setRankingTimeMemory(timeToSave);
  };

  const raceCategories = useRunnerFilteredCategories(
    allCategories,
    processedRunners,
    selectedRace ? new Date(selectedRace.startTime) : undefined,
  );

  // Clear category param if a category is selected but no runner is in it in the ranking
  React.useEffect(() => {
    if (raceCategories && selectedCategoryCode && !(selectedCategoryCode in raceCategories)) {
      void setSelectedCategory(null);
    }
  }, [raceCategories, selectedCategoryCode, setSelectedCategory]);

  // Clear URL params on component unmount
  React.useEffect(
    () => () => {
      void setSelectedCategory(null);
      void setSelectedGender(null);
      void setSelectedTimeMode(null);
      void setRankingTime(null);
    },
    [setRankingTime, setSelectedCategory, setSelectedGender, setSelectedTimeMode],
  );

  const isRaceNotFinished = !!selectedRace && !isRaceFinished(selectedRace, serverTimeOffset);

  const showLastPassageTime = React.useMemo(() => {
    if (selectedRace?.isBasicRanking) {
      return false;
    }

    if (isRaceNotFinished) {
      return true;
    }

    return !selectedRace?.isImmediateStop || selectedTimeMode === RankingTimeMode.AT;
  }, [isRaceNotFinished, selectedRace?.isBasicRanking, selectedRace?.isImmediateStop, selectedTimeMode]);

  const formatGapMode = React.useMemo<FormatGapMode>(() => {
    if (isRaceNotFinished || selectedTimeMode === RankingTimeMode.AT || !selectedRace?.isImmediateStop) {
      return FormatGapMode.LAPS_OR_TIME;
    }

    return FormatGapMode.LAPS_OR_DISTANCE;
  }, [isRaceNotFinished, selectedRace?.isImmediateStop, selectedTimeMode]);

  if (!selectedRace) {
    return <CircularLoader />;
  }

  return (
    <Card className="gap-default flex flex-col">
      <h2>Classement de la course {selectedRace.name}</h2>

      <div className="flex flex-wrap gap-x-10 gap-y-3 print:hidden">
        <RankingSettings
          categories={raceCategories}
          onCategorySelect={onCategorySelect}
          onGenderSelect={onGenderSelect}
          setTimeMode={onTimeModeSelect}
          onRankingTimeSave={onRankingTimeSave}
          selectedCategoryCode={selectedCategoryCode}
          selectedGender={selectedGender ?? "mixed"}
          showTimeModeSelect={!selectedRace.isBasicRanking}
          selectedTimeMode={selectedTimeMode}
          currentRankingTime={selectedRankingTime ?? selectedRace.duration * 1000}
          maxRankingTime={selectedRace.duration * 1000}
          isRaceFinished={isRaceFinished(selectedRace, serverTimeOffset)}
        />
      </div>

      {(deferredFilteredRanking === null || isPending) && <CircularLoader />}

      {deferredFilteredRanking !== null && !isPending && (
        <>
          {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
            <RankingTable
              race={selectedRace}
              ranking={deferredFilteredRanking}
              tableCategoryCode={selectedCategoryCode}
              tableGender={selectedGender ?? "mixed"}
              tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
              showLastPassageTime={showLastPassageTime}
              formatGapMode={formatGapMode}
              showRunnerStoppedBadges={isRaceNotFinished}
            />
          )}

          {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
            <ResponsiveRankingTable
              race={selectedRace}
              ranking={deferredFilteredRanking}
              tableCategoryCode={selectedCategoryCode}
              tableGender={selectedGender ?? "mixed"}
              tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
              showLastPassageTime={showLastPassageTime}
              formatGapMode={formatGapMode}
              showRunnerStoppedBadges={isRaceNotFinished}
            />
          )}
        </>
      )}
    </Card>
  );
}
