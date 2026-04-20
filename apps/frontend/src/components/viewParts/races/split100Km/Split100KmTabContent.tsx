import React from "react";
import { useQueryState } from "nuqs";
import type { GenderWithMixed } from "@live24hisere/core/types";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { SearchParam } from "../../../../constants/searchParams";
import { WINDOW_WIDTH_BREAKPOINTS } from "../../../../constants/ui/sizing";
import { appDataContext } from "../../../../contexts/AppDataContext";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { useAllCategories } from "../../../../hooks/categories/useAllCategories";
import { useRunnerFilteredCategories } from "../../../../hooks/categories/useRunnerFilteredCategories";
import { useProcessedRunners } from "../../../../hooks/runners/useProcessedRunners";
import { useSplitDistanceRanking } from "../../../../hooks/runners/useSplitDistanceRanking";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { parseAsGender } from "../../../../queryStringParsers/parseAsGender";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import RankingSettings from "../ranking/RankingSettings";
import ResponsiveSplit100KmTable from "./responsive/ResponsiveSplit100KmTable";
import Split100KmTable from "./Split100KmTable";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = WINDOW_WIDTH_BREAKPOINTS.XL;

export function Split100KmTabContent(): React.ReactElement {
  const { selectedRace, selectedRaceRunners } = React.useContext(racesViewContext);
  const { customRunnerCategories } = React.useContext(appDataContext);

  const [selectedCategoryCode, setSelectedCategoryCode] = useQueryState(SearchParam.CATEGORY);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

  const getCategory = useGetRunnerCategory();

  const { width: windowWidth } = useWindowDimensions();

  const allCategories = useAllCategories(
    selectedRace ? new Date(selectedRace.startTime) : undefined,
    customRunnerCategories,
  );

  const processedRunners = useProcessedRunners(selectedRaceRunners, selectedRace);

  const ranking = useSplitDistanceRanking(selectedRace ?? undefined, processedRunners, 100000);

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

  const raceCategories = useRunnerFilteredCategories(
    allCategories,
    processedRunners,
    selectedRace ? new Date(selectedRace.startTime) : undefined,
  );

  // Clear category param if a category is selected but no runner is in it in the ranking
  React.useEffect(() => {
    if (raceCategories && selectedCategoryCode && !(selectedCategoryCode in raceCategories)) {
      void setSelectedCategoryCode(null);
    }
  }, [raceCategories, selectedCategoryCode, setSelectedCategoryCode]);

  // Clear URL params on component unmount
  React.useEffect(
    () => () => {
      void setSelectedCategoryCode(null);
      void setSelectedGender(null);
    },
    [setSelectedCategoryCode, setSelectedGender],
  );

  const onCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.target.value;

    trackEvent(TrackedEvent.CHANGE_SPLIT_100KM_CATEGORY, { category: value });

    if (value === "scratch") {
      void setSelectedCategoryCode(null);
      return;
    }

    void setSelectedCategoryCode(value);
  };

  const onGenderSelect = (gender: GenderWithMixed): void => {
    trackEvent(TrackedEvent.CHANGE_SPLIT_100KM_GENDER, { gender });

    if (gender === "mixed") {
      void setSelectedGender(null);
      return;
    }

    void setSelectedGender(gender);
  };

  if (!selectedRace) {
    return <CircularLoader />;
  }

  return (
    <Card className="gap-default flex flex-col">
      <h2>Passages aux 100 km sur la course {selectedRace.name}</h2>

      <div className="flex flex-wrap gap-x-10 gap-y-3 print:hidden">
        <RankingSettings
          selectedCategoryCode={selectedCategoryCode}
          categories={raceCategories}
          selectedGender={selectedGender ?? "mixed"}
          onCategorySelect={onCategorySelect}
          onGenderSelect={onGenderSelect}
          showTimeModeSelect={false}
        />
      </div>

      {(deferredFilteredRanking === null || isPending) && <CircularLoader />}

      {deferredFilteredRanking !== null && !isPending && deferredFilteredRanking.length === 0 && (
        <p>Aucun coureur n'a atteint les 100 km.</p>
      )}

      {deferredFilteredRanking !== null && !isPending && deferredFilteredRanking.length > 0 && (
        <>
          {deferredFilteredRanking.some((runner) => !runner.exact) && (
            <p className="text-sm text-neutral-500">
              Le temps de passage à 100 km n'a pas été chronométré exactement à cette distance ; il est estimé par
              rapport aux deux passages les plus proches.
            </p>
          )}

          {windowWidth > RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
            <Split100KmTable
              race={selectedRace}
              ranking={deferredFilteredRanking}
              tableCategoryCode={selectedCategoryCode}
              tableGender={selectedGender ?? "mixed"}
            />
          )}

          {windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH && (
            <ResponsiveSplit100KmTable
              race={selectedRace}
              ranking={deferredFilteredRanking}
              tableCategoryCode={selectedCategoryCode}
              tableGender={selectedGender ?? "mixed"}
            />
          )}
        </>
      )}
    </Card>
  );
}
