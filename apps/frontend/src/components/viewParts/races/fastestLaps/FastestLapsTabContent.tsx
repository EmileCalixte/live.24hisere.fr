import React from "react";
import { useQueryState } from "nuqs";
import { SearchParam } from "../../../../constants/searchParams";
import { appDataContext } from "../../../../contexts/AppDataContext";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { useAllCategories } from "../../../../hooks/categories/useAllCategories";
import { useRunnerFilteredCategories } from "../../../../hooks/categories/useRunnerFilteredCategories";
import { useProcessedRunners } from "../../../../hooks/runners/useProcessedRunners";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import { parseAsGender } from "../../../../queryStringParsers/parseAsGender";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";

export function FastestLapsTabContent(): React.ReactElement {
  const { selectedRace, selectedRaceRunners } = React.useContext(racesViewContext);
  const { customRunnerCategories } = React.useContext(appDataContext);

  const [selectedCategoryCode, setSelectedCategory] = useQueryState(SearchParam.CATEGORY);
  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

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

  if (!selectedRace) {
    return <CircularLoader />;
  }

  return (
    <Card>
      <h2>Tours les plus rapides sur la course {selectedRace.name}</h2>
    </Card>
  );
}
