import React from "react";
import { ALL_CATEGORY_CODES, getCategoryList } from "@emilecalixte/ffa-categories";
import { parseAsInteger, useQueryState } from "nuqs";
import type { EditionWithRaceCount, GenderWithMixed, RaceWithRunnerCount } from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { RankingTimeMode } from "../../constants/rankingTimeMode";
import { SearchParam } from "../../constants/searchParams";
import { appContext } from "../../contexts/AppContext";
import { useGetPublicEditions } from "../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useGetPublicEditionRaces } from "../../hooks/api/requests/public/races/useGetPublicEditionRaces";
import { useGetPublicRaceRunners } from "../../hooks/api/requests/public/runners/useGetPublicRaceRunners";
import { useRankingTimeQueryString } from "../../hooks/queryString/useRankingTimeQueryString";
import { useProcessedRunners } from "../../hooks/runners/useProcessedRunners";
import { useEditionSelectOptions } from "../../hooks/useEditionSelectOptions";
import { useGetRunnerCategory } from "../../hooks/useGetRunnerCategory";
import { useRaceSelectOptions } from "../../hooks/useRaceSelectOptions";
import { useRanking } from "../../hooks/useRanking";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { parseAsGender } from "../../queryStringParsers/parseAsGender";
import { isRaceFinished } from "../../utils/raceUtils";
import { FormatGapMode } from "../../utils/runnerUtils";
import { Card } from "../ui/Card";
import CircularLoader from "../ui/CircularLoader";
import Select from "../ui/forms/Select";
import Page from "../ui/Page";
import RankingSettings from "../viewParts/ranking/RankingSettings";
import RankingTable from "../viewParts/ranking/rankingTable/RankingTable";
import ResponsiveRankingTable from "../viewParts/ranking/rankingTable/responsive/ResponsiveRankingTable";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

export default function RankingView(): React.ReactElement {
  const [selectedEditionId, setSelectedEditionId] = useQueryState(SearchParam.EDITION, parseAsInteger);
  const [selectedRaceId, setSelectedRaceId] = useQueryState(SearchParam.RACE, parseAsInteger);
  const [selectedCategoryCode, setSelectedCategory] = useQueryState(SearchParam.CATEGORY);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

  const getCategory = useGetRunnerCategory();

  const getRaceRunnersQuery = useGetPublicRaceRunners(selectedRaceId ?? undefined);
  const runners = getRaceRunnersQuery.data?.runners;

  const { serverTimeOffset, customRunnerCategories } = React.useContext(appContext).appData;

  const { width: windowWidth } = useWindowDimensions();

  const getEditionsQuery = useGetPublicEditions();
  const editions = getEditionsQuery.data?.editions;

  const selectedEdition = React.useMemo<EditionWithRaceCount | null>(
    () => editions?.find((edition) => edition.id === selectedEditionId) ?? null,
    [editions, selectedEditionId],
  );

  const getRacesQuery = useGetPublicEditionRaces(selectedEdition?.id);
  const races = getRacesQuery.data?.races;

  const selectedRace = React.useMemo<RaceWithRunnerCount | null>(
    () => races?.find((race) => race.id === selectedRaceId) ?? null,
    [races, selectedRaceId],
  );

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

  const editionOptions = useEditionSelectOptions(editions);
  const raceOptions = useRaceSelectOptions(races);

  const processedRunners = useProcessedRunners(runners, selectedRace, !rankingDate);

  const ranking = useRanking(selectedRace ?? undefined, processedRunners, rankingDate);

  const onEditionSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    void setSelectedEditionId(parseInt(e.target.value));
  };

  const onRaceSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    void setSelectedRaceId(parseInt(e.target.value));
  };

  const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;

    if (value === "scratch") {
      void setSelectedCategory(null);
      return;
    }

    void setSelectedCategory(value);
  };

  const onGenderSelect = (gender: GenderWithMixed): void => {
    if (gender === "mixed") {
      void setSelectedGender(null);
      return;
    }

    void setSelectedGender(gender);
  };

  const onTimeModeSelect = (timeMode: RankingTimeMode): void => {
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

  // Auto-select the first edition
  React.useEffect(() => {
    if (editions && editions.length > 0 && selectedEdition === null) {
      void setSelectedEditionId(editions[0].id);
    }
  }, [editions, selectedEdition, setSelectedEditionId]);

  // Auto-select the first race in the selected edition
  React.useEffect(() => {
    if (races && races.length > 0 && selectedRace === null) {
      void setSelectedRaceId(races[0].id);
    }
  }, [races, selectedRace, setSelectedRaceId]);

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

  return (
    <Page id="ranking" htmlTitle="Classements" title="Classements" contentClassName="flex flex-col gap-3">
      {editions && editions.length < 1 && <p>Aucune donnée disponible.</p>}

      <Card className="grid-rows-auto grid grid-cols-6 gap-3 print:hidden">
        {editions && editions.length >= 2 && (
          <Select
            className="col-span-full sm:col-span-4 md:col-span-3 lg:col-span-2 2xl:col-span-1"
            label="Édition"
            options={editionOptions}
            onChange={onEditionSelect}
            value={selectedEdition ? selectedEdition.id : undefined}
            placeholderLabel="Sélectionnez une édition"
          />
        )}
        {selectedEdition && (
          <Select
            className="col-span-full sm:col-span-4 md:col-span-3 lg:col-span-2 2xl:col-span-1"
            label="Course"
            options={raceOptions}
            onChange={onRaceSelect}
            value={selectedRace ? selectedRace.id : undefined}
            placeholderLabel="Sélectionnez une course"
          />
        )}
      </Card>

      {selectedRace && (
        <>
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
        </>
      )}
    </Page>
  );
}
