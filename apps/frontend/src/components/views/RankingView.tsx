import React from "react";
import {
  ALL_CATEGORY_CODES,
  type CategoryCode,
  type CategoryList,
  getCategory,
  getCategoryList,
  isCategoryCode,
} from "@emilecalixte/ffa-categories";
import { parseAsInteger, useQueryState } from "nuqs";
import { Col, Row } from "react-bootstrap";
import type {
  EditionWithRaceCount,
  GenderWithMixed,
  RaceRunnerWithProcessedData,
  RaceRunnerWithProcessedPassages,
  RaceWithRunnerCount,
} from "@live24hisere/core/types";
import { objectUtils } from "@live24hisere/utils";
import { RankingTimeMode } from "../../constants/rankingTimeMode";
import { SearchParam } from "../../constants/searchParams";
import "../../css/print-ranking-table.css";
import { useGetPublicEditions } from "../../hooks/api/requests/public/editions/useGetPublicEditions";
import { useGetPublicRaces } from "../../hooks/api/requests/public/races/useGetPublicRaces";
import { useGetPublicRaceRunners } from "../../hooks/api/requests/public/runners/useGetPublicRaceRunners";
import { useRankingTimeQueryString } from "../../hooks/queryString/useRankingTimeQueryString";
import { useEditionSelectOptions } from "../../hooks/useEditionSelectOptions";
import { useRaceSelectOptions } from "../../hooks/useRaceSelectOptions";
import { useRanking } from "../../hooks/useRanking";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { parseAsCategory } from "../../queryStringParsers/parseAsCategory";
import { parseAsGender } from "../../queryStringParsers/parseAsGender";
import { getProcessedPassagesFromPassages, getRunnerProcessedDataFromPassages } from "../../utils/passageUtils";
import { isRaceFinished } from "../../utils/raceUtils";
import { getBasicRankingRunnerProcessedData } from "../../utils/runnerUtils";
import { appContext } from "../App";
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
  const [selectedCategoryCode, setSelectedCategory] = useQueryState(SearchParam.CATEGORY, parseAsCategory);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

  const getRaceRunnersQuery = useGetPublicRaceRunners(selectedRaceId ?? undefined);
  const runners = getRaceRunnersQuery.data?.runners;

  const { serverTimeOffset } = React.useContext(appContext).appData;

  const { width: windowWidth } = useWindowDimensions();

  const getEditionsQuery = useGetPublicEditions();
  const editions = getEditionsQuery.data?.editions;

  const selectedEdition = React.useMemo<EditionWithRaceCount | null>(
    () => editions?.find((edition) => edition.id === selectedEditionId) ?? null,
    [editions, selectedEditionId],
  );

  const getRacesQuery = useGetPublicRaces(selectedEdition?.id);
  const races = getRacesQuery.data?.races;

  const selectedRace = React.useMemo<RaceWithRunnerCount | null>(
    () => races?.find((race) => race.id === selectedRaceId) ?? null,
    [races, selectedRaceId],
  );

  const allCategories = React.useMemo(() => {
    if (!selectedRace) {
      return {};
    }

    return getCategoryList(new Date(selectedRace.startTime));
  }, [selectedRace]);

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

  const processedRunners = React.useMemo<
    Array<RaceRunnerWithProcessedPassages & RaceRunnerWithProcessedData> | undefined
  >(() => {
    if (!runners || !selectedRace) {
      return;
    }

    if (selectedRace.isBasicRanking) {
      return runners.map((runner) => ({
        ...runner,
        ...getBasicRankingRunnerProcessedData(runner, selectedRace),
        passages: [],
      }));
    }

    return runners.map((runner) => ({
      ...runner,
      ...getRunnerProcessedDataFromPassages(runner, selectedRace, runner.passages, !rankingDate),
      passages: getProcessedPassagesFromPassages(selectedRace, runner.passages),
    }));
  }, [rankingDate, runners, selectedRace]);

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

    if (!isCategoryCode(value)) {
      void setSelectedCategory(null);
      throw new Error(`${value} is not a valid category code`);
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

  const categories = React.useMemo<CategoryList | null>(() => {
    if (!ranking || !selectedRace) {
      return null;
    }

    const categoriesInRanking = new Set<CategoryCode>();

    for (const runner of ranking) {
      categoriesInRanking.add(getCategory(Number(runner.birthYear), { date: new Date(selectedRace.startTime) }).code);
    }

    const categoriesToRemove: CategoryCode[] = [];

    for (const categoryCode of ALL_CATEGORY_CODES) {
      if (!categoriesInRanking.has(categoryCode)) {
        categoriesToRemove.push(categoryCode);
      }
    }

    return objectUtils.excludeKeys(allCategories, categoriesToRemove);
  }, [allCategories, ranking, selectedRace]);

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

  const isRaceInProgress = !!selectedRace && !isRaceFinished(selectedRace, serverTimeOffset);

  const showLastPassageTime =
    (isRaceInProgress || selectedTimeMode === RankingTimeMode.AT) && !selectedRace?.isBasicRanking;

  return (
    <Page id="ranking" title="Classements">
      <Row className="hide-on-print">
        <Col>
          <h1>Classements</h1>
        </Col>
      </Row>

      {editions && editions.length < 1 && (
        <Row>
          <Col>
            <p>Aucune donnée disponible.</p>
          </Col>
        </Row>
      )}

      <Row className="hide-on-print mb-3 gap-3">
        {editions && editions.length >= 2 && (
          <Col xl={3} lg={4} md={6} sm={9} xs={12}>
            <Select
              label="Édition"
              options={editionOptions}
              onChange={onEditionSelect}
              value={selectedEdition ? selectedEdition.id : undefined}
              placeholderLabel="Sélectionnez une édition"
            />
          </Col>
        )}
        {selectedEdition && (
          <Col xl={3} lg={4} md={6} sm={9} xs={12}>
            <Select
              label="Course"
              options={raceOptions}
              onChange={onRaceSelect}
              value={selectedRace ? selectedRace.id : undefined}
              placeholderLabel="Sélectionnez une course"
            />
          </Col>
        )}
      </Row>

      {selectedRace && (
        <>
          <Row className="hide-on-print mb-3 row-cols-auto gap-3">
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
          </Row>

          {!ranking && <CircularLoader />}

          {ranking && (
            <Row>
              <Col>
                {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
                  <RankingTable
                    race={selectedRace}
                    ranking={ranking}
                    tableCategoryCode={selectedCategoryCode}
                    tableGender={selectedGender ?? "mixed"}
                    tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
                    showLastPassageTime={showLastPassageTime}
                    showRunnerStoppedBadges={isRaceInProgress}
                  />
                )}

                {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
                  <div>
                    <div className="mb-3">Cliquez sur un coureur pour consulter ses données de course</div>

                    <ResponsiveRankingTable
                      race={selectedRace}
                      ranking={ranking}
                      tableCategoryCode={selectedCategoryCode}
                      tableGender={selectedGender ?? "mixed"}
                      tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
                      showLastPassageTime={showLastPassageTime}
                      showRunnerStoppedBadges={isRaceInProgress}
                    />
                  </div>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </Page>
  );
}
