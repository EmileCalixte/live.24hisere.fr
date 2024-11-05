import React from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Col, Row } from "react-bootstrap";
import { ALL_CATEGORIES } from "@live24hisere/core/constants";
import {
  type CategoryShortCode,
  type FullCategoriesDict,
  type GenderWithMixed,
  type PartialCategoriesDict,
  type RaceWithRunnerCount,
  type RunnerWithProcessedData,
  type RunnerWithProcessedPassages,
} from "@live24hisere/core/types";
import { categoryUtils, objectUtils } from "@live24hisere/utils";
import { RankingTimeMode } from "../../constants/rankingTimeMode";
import { SearchParam } from "../../constants/searchParams";
import "../../css/print-ranking-table.css";
import { useRankingTimeQueryString } from "../../hooks/queryString/useRankingTimeQueryString";
import { useIntervalApiRequest } from "../../hooks/useIntervalApiRequest";
import { useRanking } from "../../hooks/useRanking";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { parseAsCategory } from "../../queryStringParsers/parseAsCategory";
import { parseAsGender } from "../../queryStringParsers/parseAsGender";
import { getRaces } from "../../services/api/raceService";
import { getRaceRunners } from "../../services/api/runnerService";
import { getProcessedPassagesFromPassages, getRunnerProcessedDataFromPassages } from "../../utils/passageUtils";
import { getRacesSelectOptions } from "../../utils/raceUtils";
import CircularLoader from "../ui/CircularLoader";
import Select from "../ui/forms/Select";
import Page from "../ui/Page";
import RankingSettings from "../viewParts/ranking/RankingSettings";
import RankingTable from "../viewParts/ranking/rankingTable/RankingTable";
import ResponsiveRankingTable from "../viewParts/ranking/rankingTable/responsive/ResponsiveRankingTable";
import { publicContext } from "./public/Public";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = 960;

export default function RankingView(): React.ReactElement {
  const [selectedRaceId, setSelectedRaceId] = useQueryState(SearchParam.RACE, parseAsInteger);
  const [selectedCategory, setSelectedCategory] = useQueryState(SearchParam.CATEGORY, parseAsCategory);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

  const { selectedEdition } = React.useContext(publicContext);

  const { width: windowWidth } = useWindowDimensions();

  const races = useIntervalApiRequest(getRaces).json?.races;

  const selectedRace = React.useMemo<RaceWithRunnerCount | null>(() => {
    return races?.find((race) => race.id === selectedRaceId) ?? null;
  }, [races, selectedRaceId]);

  const {
    selectedTimeMode,
    setSelectedTimeMode,
    selectedRankingTime,
    rankingDate,
    setRankingTime,
    setRankingTimeMemory,
  } = useRankingTimeQueryString(selectedRace);

  const racesOptions = React.useMemo(() => {
    return getRacesSelectOptions(races);
  }, [races]);

  const fetchRunners = React.useMemo(() => {
    if (!selectedRace) {
      return;
    }

    return async () => await getRaceRunners(selectedRace.id);
  }, [selectedRace]);

  const runners = useIntervalApiRequest(fetchRunners).json?.runners;

  const processedRunners = React.useMemo<
    Array<RunnerWithProcessedPassages & RunnerWithProcessedData> | undefined
  >(() => {
    if (!runners || !selectedRace) {
      return;
    }

    return runners.map((runner) => ({
      ...runner,
      ...getRunnerProcessedDataFromPassages(selectedRace, runner.passages),
      passages: getProcessedPassagesFromPassages(selectedRace, runner.passages),
    }));
  }, [runners, selectedRace]);

  const ranking = useRanking(selectedRace ?? undefined, processedRunners, rankingDate);

  const onRaceSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    void setSelectedRaceId(parseInt(e.target.value));
  };

  const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;

    if (value === "scratch") {
      void setSelectedCategory(null);
      return;
    }

    if (!categoryUtils.isCategoryCode(value)) {
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

  const categories = React.useMemo<PartialCategoriesDict | null>(() => {
    if (!ranking) {
      return null;
    }

    const categoriesInRanking = new Set<CategoryShortCode>();

    for (const runner of ranking) {
      categoriesInRanking.add(categoryUtils.getCategoryCodeFromBirthYear(runner.birthYear));
    }

    const categoriesToRemove: Array<keyof FullCategoriesDict> = [];

    for (const categoryCode of objectUtils.keys(ALL_CATEGORIES)) {
      if (!categoriesInRanking.has(categoryCode)) {
        categoriesToRemove.push(categoryCode);
      }
    }

    return objectUtils.excludeKeys(ALL_CATEGORIES, categoriesToRemove);
  }, [ranking]);

  // Clear category param if a category is selected but no runner is in it in the ranking
  React.useEffect(() => {
    if (categories && selectedCategory && !(selectedCategory in categories)) {
      void setSelectedCategory(null);
    }
  }, [categories, selectedCategory, setSelectedCategory]);

  return (
    <Page id="ranking" title="Classements">
      <Row className="hide-on-print">
        <Col>
          <h1>Classements</h1>
        </Col>
      </Row>

      {selectedEdition === null ? (
        <Row>
          <Col>
            <p>Sélectionnez une édition ci-dessus pour accéder aux courses et à leurs classements</p>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="hide-on-print mb-3">
            <Col xl={3} lg={4} md={6} sm={9} xs={12}>
              <Select
                label="Course"
                options={racesOptions}
                onChange={onRaceSelect}
                value={selectedRace ? selectedRace.id : undefined}
                placeholderLabel="Sélectionnez une course"
              />
            </Col>
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
                  selectedCategory={selectedCategory}
                  selectedGender={selectedGender ?? "mixed"}
                  selectedTimeMode={selectedTimeMode}
                  currentRankingTime={selectedRankingTime ?? selectedRace.duration * 1000}
                  maxRankingTime={selectedRace.duration * 1000}
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
                        tableCategory={selectedCategory}
                        tableGender={selectedGender ?? "mixed"}
                        tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
                      />
                    )}

                    {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
                      <div>
                        <div className="mb-3">Cliquez sur un coureur pour consulter ses données de course</div>

                        <ResponsiveRankingTable
                          race={selectedRace}
                          ranking={ranking}
                          tableCategory={selectedCategory}
                          tableGender={selectedGender ?? "mixed"}
                          tableRaceDuration={selectedTimeMode === RankingTimeMode.AT ? selectedRankingTime : null}
                        />
                      </div>
                    )}
                  </Col>
                </Row>
              )}
            </>
          )}
        </>
      )}
    </Page>
  );
}
