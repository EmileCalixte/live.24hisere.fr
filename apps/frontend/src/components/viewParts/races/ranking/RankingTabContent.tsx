import React from "react";
import { ALL_CATEGORY_CODES, getCategoryList } from "@emilecalixte/ffa-categories";
import { useQueryState } from "nuqs";
import type { GenderWithMixed } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { RankingTimeMode } from "../../../../constants/rankingTimeMode";
import { SearchParam } from "../../../../constants/searchParams";
import { appContext } from "../../../../contexts/AppContext";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { useGetPublicRaceRunners } from "../../../../hooks/api/requests/public/runners/useGetPublicRaceRunners";
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

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

export function RankingTabContent(): React.ReactElement {
  const { selectedRace } = React.useContext(racesViewContext);
  const { serverTimeOffset, customRunnerCategories } = React.useContext(appContext).appData;

  const [selectedCategoryCode, setSelectedCategory] = useQueryState(SearchParam.CATEGORY);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

  const getCategory = useGetRunnerCategory();

  const getRaceRunnersQuery = useGetPublicRaceRunners(selectedRace?.id);
  const runners = getRaceRunnersQuery.data?.runners;

  const { width: windowWidth } = useWindowDimensions();

  const allCategories = React.useMemo(() => {
    if (!selectedRace) {
      return {};
    }

    const allCategories: Record<string, string> = getCategoryList(new Date(selectedRace.startTime));

    for (const customCategory of customRunnerCategories) {
      allCategories[customCategory.code] = customCategory.name;
    }

    return allCategories;
  }, [customRunnerCategories, selectedRace]);

  const {
    selectedTimeMode,
    setSelectedTimeMode,
    selectedRankingTime,
    rankingDate,
    setRankingTime,
    setRankingTimeMemory,
  } = useRankingTimeQueryString(selectedRace);

  const processedRunners = useProcessedRunners(runners, selectedRace, !rankingDate);

  const ranking = useRanking(selectedRace ?? undefined, processedRunners, rankingDate);

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

  const categories = React.useMemo<Record<string, string> | null>(() => {
    if (!ranking || !selectedRace) {
      return null;
    }

    const categoriesInRanking = new Set<string>();

    for (const runner of ranking) {
      categoriesInRanking.add(getCategory(runner, new Date(selectedRace.startTime)).code);
    }

    const categoriesToRemove = [];

    const allCategoryCodes = [...ALL_CATEGORY_CODES, ...customRunnerCategories.map((c) => c.code)];

    for (const categoryCode of allCategoryCodes) {
      if (!categoriesInRanking.has(categoryCode)) {
        categoriesToRemove.push(categoryCode);
      }
    }

    return objectUtils.excludeKeys(allCategories, categoriesToRemove);
  }, [allCategories, customRunnerCategories, getCategory, ranking, selectedRace]);

  // Clear category param if a category is selected but no runner is in it in the ranking
  React.useEffect(() => {
    if (categories && selectedCategoryCode && !(selectedCategoryCode in categories)) {
      void setSelectedCategory(null);
    }
  }, [categories, selectedCategoryCode, setSelectedCategory]);

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
    <Card className="flex flex-col gap-3">
      <h2>Classement de la course {selectedRace.name}</h2>

      <div className="flex flex-wrap gap-x-10 gap-y-3 print:hidden">
        <RankingSettings
          categories={categories}
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

      {!ranking && <CircularLoader />}

      {ranking && (
        <>
          {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
            <RankingTable
              race={selectedRace}
              ranking={ranking}
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
              ranking={ranking}
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
