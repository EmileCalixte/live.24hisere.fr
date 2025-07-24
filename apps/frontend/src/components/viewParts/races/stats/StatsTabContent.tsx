import React from "react";
import { getCategoryList, isCategoryCode } from "@emilecalixte/ffa-categories";
import { GENDER } from "@live24hisere/core/constants";
import { objectUtils } from "@live24hisere/utils";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { useProcessedRunners } from "../../../../hooks/runners/useProcessedRunners";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import { isRaceFinished } from "../../../../utils/raceUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { type CategoryDistribution, CategoryDistributionChart } from "./charts/CategoryDistributionChart";
import { GenderDistributionChart } from "./charts/GenderDistributionChart";

export function StatsTabContent(): React.ReactElement {
  const { selectedRace, selectedEdition, selectedRaceRunners } = React.useContext(racesViewContext);

  const getCategory = useGetRunnerCategory();

  const processedRunners = useProcessedRunners(
    selectedRaceRunners,
    selectedRace,
    !!selectedRace && isRaceFinished(selectedRace),
  );

  const maleCount = React.useMemo(
    () => processedRunners?.reduce((count, runner) => (runner.gender === GENDER.M ? count + 1 : count), 0) ?? 0,
    [processedRunners],
  );

  const femaleCount = React.useMemo(
    () => processedRunners?.reduce((count, runner) => (runner.gender === GENDER.F ? count + 1 : count), 0) ?? 0,
    [processedRunners],
  );

  const raceStartDate = React.useMemo(() => new Date(selectedRace?.startTime ?? 0), [selectedRace?.startTime]);

  const categories = React.useMemo(() => getCategoryList(raceStartDate), [raceStartDate]);

  const categoriesCount = React.useMemo(() => {
    const categoriesCount: CategoryDistribution = objectUtils.fromEntries(
      [...objectUtils.keys(categories), "custom"].map((categoryCode) => [categoryCode, 0]),
    );

    for (const runner of processedRunners ?? []) {
      const categoryCode = getCategory(runner, raceStartDate).code;

      const index = isCategoryCode(categoryCode) ? categoryCode : "custom";

      categoriesCount[index] = (categoriesCount[index] ?? 0) + 1;
    }

    return objectUtils.fromEntries(objectUtils.entries(categoriesCount).filter(([, count]) => count > 0));
  }, [categories, getCategory, processedRunners, raceStartDate]);

  if (!selectedRace || !selectedEdition || !processedRunners) {
    return <CircularLoader />;
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2>Statistiques de la course {selectedRace.name}</h2>

      <section className="flex flex-col gap-3">
        <h3>Coureurs</h3>

        <div className="grid-rows-auto grid grid-cols-4 gap-3">
          <div className="col-span-4 lg:col-span-2 2xl:col-span-1">
            <h4>Répartition hommes/femmes</h4>
            <GenderDistributionChart maleCount={maleCount} femaleCount={femaleCount} />
          </div>

          <div className="col-span-4 lg:col-span-2 2xl:col-span-1">
            <h4>Répartition des catégories d'âge</h4>
            <CategoryDistributionChart categoriesCount={categoriesCount} categories={categories} />
          </div>
        </div>
      </section>
    </Card>
  );
}
