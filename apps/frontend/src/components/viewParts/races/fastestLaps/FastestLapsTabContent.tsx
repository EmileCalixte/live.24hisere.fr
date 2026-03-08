import React from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import type { GenderWithMixed } from "@live24hisere/core/types";
import { arrayUtils } from "@live24hisere/utils";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { FASTEST_LAPS_SHOW_MODES, FastestLapsShowMode } from "../../../../constants/fastestLapsShowMode";
import { SearchParam } from "../../../../constants/searchParams";
import { WINDOW_WIDTH_BREAKPOINTS } from "../../../../constants/ui/sizing";
import { appDataContext } from "../../../../contexts/AppDataContext";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { useAllCategories } from "../../../../hooks/categories/useAllCategories";
import { useRunnerFilteredCategories } from "../../../../hooks/categories/useRunnerFilteredCategories";
import { useProcessedRunners } from "../../../../hooks/runners/useProcessedRunners";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { parseAsEnum } from "../../../../queryStringParsers/parseAsEnum";
import { parseAsGender } from "../../../../queryStringParsers/parseAsGender";
import { formatMsAsDuration, formatMsDurationHms } from "../../../../utils/durationUtils";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { getPassagesWithRunnersFromPassagesAndRunners } from "../../../../utils/passageUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import Pagination from "../../../ui/pagination/Pagination";
import { Table, Td, Th, Tr } from "../../../ui/Table";
import { RunnerNameTd } from "../RunnerNameTd";
import FastestLapsSettings from "./FastestLapsSettings";
import ResponsiveFastestLapsTable from "./responsive/ResponsiveFastestLapsTable";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = WINDOW_WIDTH_BREAKPOINTS.LG;

export function FastestLapsTabContent(): React.ReactElement {
  const { selectedRace, selectedRaceRunners } = React.useContext(racesViewContext);
  const { customRunnerCategories } = React.useContext(appDataContext);

  const [selectedCategoryCode, setSelectedCategory] = useQueryState(SearchParam.CATEGORY);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);
  const [selectedShowMode, setSelectedShowMode] = useQueryState(
    SearchParam.SHOW,
    parseAsEnum(FASTEST_LAPS_SHOW_MODES).withDefault(FastestLapsShowMode.ONLY_BEST_ONE),
  );

  const [page, setPage] = useQueryState(SearchParam.PAGE, parseAsInteger.withDefault(1));

  const { width: windowWidth } = useWindowDimensions();

  const getCategory = useGetRunnerCategory();

  const raceStartDate = React.useMemo(
    () => (selectedRace ? new Date(selectedRace.startTime) : undefined),
    [selectedRace],
  );

  const processedRunners = useProcessedRunners(selectedRaceRunners, selectedRace, true);

  const allCategories = useAllCategories(raceStartDate, customRunnerCategories);

  const raceCategories = useRunnerFilteredCategories(allCategories, processedRunners, raceStartDate);

  const filteredProcessedRunners = React.useMemo(
    () =>
      processedRunners?.filter((runner) => {
        if (selectedCategoryCode && raceStartDate && getCategory(runner, raceStartDate).code !== selectedCategoryCode) {
          return false;
        }

        if (selectedGender && runner.gender !== selectedGender) {
          return false;
        }

        return true;
      }),
    [getCategory, processedRunners, raceStartDate, selectedCategoryCode, selectedGender],
  );

  const passagesWithRunners = React.useMemo(() => {
    if (!filteredProcessedRunners) {
      return undefined;
    }

    return getPassagesWithRunnersFromPassagesAndRunners(filteredProcessedRunners);
  }, [filteredProcessedRunners]);

  const fastestLaps = React.useMemo(() => {
    if (!passagesWithRunners) {
      return undefined;
    }

    const fastestLaps = passagesWithRunners
      .filter((passage) => passage.processed.lapNumber !== null)
      .toSorted((a, b) => a.processed.lapDuration - b.processed.lapDuration);

    if (selectedShowMode === FastestLapsShowMode.ALL) {
      return fastestLaps;
    }

    const alreadyOneLapRunnerIds = new Set<number>();

    return fastestLaps.filter((passage) => {
      if (alreadyOneLapRunnerIds.has(passage.runner.id)) {
        return false;
      }

      alreadyOneLapRunnerIds.add(passage.runner.id);
      return true;
    });
  }, [passagesWithRunners, selectedShowMode]);

  const noData = !!fastestLaps && fastestLaps.length < 1;

  const paginatedFastestLaps = React.useMemo(() => {
    if (!fastestLaps) {
      return undefined;
    }

    return arrayUtils.chunk(fastestLaps, 50);
  }, [fastestLaps]);

  const pageCount = paginatedFastestLaps?.length;

  const pageContent = React.useMemo(() => {
    if (!paginatedFastestLaps) {
      return undefined;
    }

    return paginatedFastestLaps[page - 1];
  }, [page, paginatedFastestLaps]);

  const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;

    trackEvent(TrackedEvent.CHANGE_FASTEST_LAPS_CATEGORY, { category: value });

    if (value === "scratch") {
      void setSelectedCategory(null);
      return;
    }

    void setSelectedCategory(value);
  };

  const onGenderSelect = (gender: GenderWithMixed): void => {
    trackEvent(TrackedEvent.CHANGE_FASTEST_LAPS_GENDER, { gender });

    if (gender === "mixed") {
      void setSelectedGender(null);
      return;
    }

    void setSelectedGender(gender);
  };

  const onShowModeSelect = (showMode: FastestLapsShowMode): void => {
    trackEvent(TrackedEvent.CHANGE_FASTEST_LAPS_SHOW_MODE, { mode: showMode });

    void setSelectedShowMode(showMode);
  };

  React.useEffect(() => {
    if (!pageCount) {
      return;
    }

    if (page > pageCount) {
      void setPage(1);
    }
  }, [page, pageCount, setPage]);

  // Clear URL params on component unmount or on selected race change
  React.useEffect(
    () => () => {
      void setSelectedCategory(null);
      void setSelectedGender(null);
      void setSelectedShowMode(null);
      void setPage(null);
    },
    [setPage, setSelectedCategory, setSelectedGender, selectedRace, setSelectedShowMode],
  );

  if (!selectedRace) {
    return <CircularLoader />;
  }

  return (
    <Card className="gap-default flex flex-col">
      <h2>Tours les plus rapides sur la course {selectedRace.name}</h2>

      <div className="flex flex-wrap gap-x-10 gap-y-3 print:hidden">
        <FastestLapsSettings
          categories={raceCategories}
          selectedCategoryCode={selectedCategoryCode}
          onCategorySelect={onCategorySelect}
          selectedGender={selectedGender ?? "mixed"}
          onGenderSelect={onGenderSelect}
          selectedShowMode={selectedShowMode}
          onShowModeSelect={onShowModeSelect}
        />
      </div>

      {noData && <p>Aucune donnée</p>}

      {pageContent === undefined ? (
        <CircularLoader />
      ) : (
        <div className="flex flex-col gap-3">
          {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
            <Table>
              <thead>
                <Tr>
                  <Th>Doss.</Th>
                  <Th>Nom</Th>
                  <Th>Durée du tour</Th>
                  <Th>Temps de course</Th>
                  <Th>Vitesse</Th>
                  <Th>Allure</Th>
                </Tr>
              </thead>
              <tbody>
                {pageContent.map((passage) => (
                  <Tr key={passage.id}>
                    <Td>{passage.runner.bibNumber}</Td>
                    <RunnerNameTd runner={passage.runner} race={selectedRace} />
                    <Td>
                      {formatMsAsDuration(passage.processed.lapDuration, {
                        forceDisplayHours: false,
                        hoursSuffix: "h ",
                        minutesSuffix: "m ",
                        secondsSuffix: "s",
                      })}
                    </Td>
                    <Td>{formatMsAsDuration(passage.processed.lapEndRaceTime)}</Td>
                    <Td>{formatFloatNumber(passage.processed.lapSpeed, 2)} km/h</Td>
                    <Td>
                      {formatMsDurationHms(passage.processed.lapPace)}
                      <> </>/ km
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}

          {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
            <ResponsiveFastestLapsTable race={selectedRace} passages={pageContent} />
          )}

          {!noData && !!pageCount && pageCount > 1 && (
            <div className="flex justify-center">
              <Pagination
                minPage={1}
                maxPage={pageCount}
                currentPage={page}
                setPage={(page) => {
                  void setPage(page);
                }}
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
