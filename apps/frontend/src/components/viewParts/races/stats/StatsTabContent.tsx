import React from "react";
import { getCategoryList, isCategoryCode } from "@emilecalixte/ffa-categories";
import { useQueryState } from "nuqs";
import { GENDER } from "@live24hisere/core/constants";
import type { GenderWithMixed, ProcessedPassage } from "@live24hisere/core/types";
import { compareUtils, objectUtils } from "@live24hisere/utils";
import { SearchParam } from "../../../../constants/searchParams";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { useProcessedRunners } from "../../../../hooks/runners/useProcessedRunners";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import { parseAsGender } from "../../../../queryStringParsers/parseAsGender";
import { getCountryName } from "../../../../utils/countryUtils";
import { isRaceFinished } from "../../../../utils/raceUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Tab, TabList, Tabs } from "../../../ui/Tabs";
import { type CategoryDistribution, CategoryDistributionChart } from "./charts/CategoryDistributionChart";
import { type CountryDistribution, CountryDistributionChart } from "./charts/CountryDistributionChart";
import { PassageCountPerTimeSlotChart } from "./charts/PassageCountPerTimeSlotChart";
import { StartingRunnersDistributionChart } from "./charts/StartingRunnersDistributionChart";

export function StatsTabContent(): React.ReactElement {
  const { selectedRace, selectedEdition, selectedRaceRunners } = React.useContext(racesViewContext);

  const [selectedGender, setSelectedGender] = useQueryState(SearchParam.GENDER, parseAsGender);

  const getCategory = useGetRunnerCategory();

  const processedRunners = useProcessedRunners(
    selectedRaceRunners,
    selectedRace,
    !!selectedRace && isRaceFinished(selectedRace),
  );

  const runnerCount = processedRunners?.length ?? 0;

  const maleCount = React.useMemo(
    () => processedRunners?.reduce((count, runner) => (runner.gender === GENDER.M ? count + 1 : count), 0) ?? 0,
    [processedRunners],
  );

  const femaleCount = React.useMemo(
    () => processedRunners?.reduce((count, runner) => (runner.gender === GENDER.F ? count + 1 : count), 0) ?? 0,
    [processedRunners],
  );

  const filteredRunners = React.useMemo(() => {
    if (!selectedGender) {
      return processedRunners;
    }

    return processedRunners?.filter((runner) => runner.gender === selectedGender);
  }, [processedRunners, selectedGender]);

  const filteredRunnerCount = filteredRunners?.length ?? 0;

  const raceStartDate = React.useMemo(() => new Date(selectedRace?.startTime ?? 0), [selectedRace?.startTime]);

  const categories = React.useMemo(() => getCategoryList(raceStartDate), [raceStartDate]);

  const countsByCategory = React.useMemo(() => {
    const countsByCategory: CategoryDistribution = objectUtils.fromEntries(
      [...objectUtils.keys(categories), "custom"].map((categoryCode) => [categoryCode, 0]),
    );

    for (const runner of filteredRunners ?? []) {
      const categoryCode = getCategory(runner, raceStartDate).code;

      const index = isCategoryCode(categoryCode) ? categoryCode : "custom";

      countsByCategory[index] = (countsByCategory[index] ?? 0) + 1;
    }

    return objectUtils.fromEntries(objectUtils.entries(countsByCategory).filter(([, count]) => count > 0));
  }, [categories, getCategory, filteredRunners, raceStartDate]);

  const countsByCountry = React.useMemo(() => {
    const countsByCountry: CountryDistribution = {};

    for (const runner of filteredRunners ?? []) {
      const countryCode = runner.countryCode && getCountryName(runner.countryCode) ? runner.countryCode : "other";

      countsByCountry[countryCode] = (countsByCountry[countryCode] ?? 0) + 1;
    }

    return objectUtils.fromEntries(
      objectUtils.entries(countsByCountry).sort(([, countA], [, countB]) => compareUtils.spaceship(countB, countA)),
    );
  }, [filteredRunners]);

  const startingCount = React.useMemo(
    () => filteredRunners?.reduce((count, runner) => (runner.totalDistance > 0 ? count + 1 : count), 0) ?? 0,
    [filteredRunners],
  );

  const allPassages = React.useMemo(
    () =>
      processedRunners?.flatMap((runner) =>
        runner.passages.toSorted((passageA: ProcessedPassage, passageB: ProcessedPassage) =>
          compareUtils.spaceship(passageA.processed.lapEndRaceTime, passageB.processed.lapEndRaceTime),
        ),
      ) ?? [],
    [processedRunners],
  );

  /**
   * Total distance of all runners, in meters
   */
  const cumulatedDistance = React.useMemo(
    () => processedRunners?.reduce((total, runner) => runner.totalDistance + total, 0) ?? 0,
    [processedRunners],
  );

  const nonStartingCount = filteredRunnerCount - startingCount;

  if (!selectedRace || !selectedEdition || !filteredRunners) {
    return <CircularLoader />;
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2>Statistiques de la course {selectedRace.name}</h2>

      <div className="flex flex-col gap-10">
        <section className="flex flex-col gap-3">
          <h3>Coureurs</h3>

          <Tabs
            value={selectedGender ?? "mixed"}
            onValueChange={(newValue: GenderWithMixed) => {
              void setSelectedGender(newValue === "mixed" ? null : newValue);
            }}
            className="text-base font-normal"
          >
            <TabList>
              <Tab value={"mixed"}>Tous ({runnerCount})</Tab>
              <Tab value={GENDER.M}>Hommes ({maleCount})</Tab>
              <Tab value={GENDER.F}>Femmes ({femaleCount})</Tab>
            </TabList>
          </Tabs>

          <div className="grid-rows-auto grid grid-cols-6 gap-5">
            <div className="col-span-6 text-center lg:col-span-3 2xl:col-span-2">
              <h4>Catégories d'âge</h4>
              <CategoryDistributionChart countsByCategory={countsByCategory} categories={categories} />
            </div>

            <div className="col-span-6 text-center lg:col-span-3 2xl:col-span-2">
              <h4>Pays</h4>
              <CountryDistributionChart countsByCountry={countsByCountry} />
            </div>

            {!selectedRace.isBasicRanking && (
              <div className="col-span-6 text-center lg:col-span-3 2xl:col-span-2">
                <h4>Partants / non-partants</h4>
                <StartingRunnersDistributionChart startingCount={startingCount} nonStartingCount={nonStartingCount} />
              </div>
            )}
          </div>
        </section>

        {!selectedRace.isBasicRanking && (
          <section className="flex flex-col gap-3">
            <h3>Tours</h3>

            <p>Distance cumulée de tous les coureurs : {formatFloatNumber(cumulatedDistance / 1000, 2)} km</p>

            <div className="col-span-6 text-center">
              <h4>Passages par heure</h4>
              <PassageCountPerTimeSlotChart race={selectedRace} passages={allPassages} timeSlotDuration={3600000} />
            </div>
          </section>
        )}
      </div>
    </Card>
  );
}
