import React from "react";
import type { AdminPassageWithRunnerIdAndRaceId, ProcessedPassage, RaceRunner } from "@live24hisere/core/types";
import { useGetAdminEditions } from "../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRacePassages } from "../../../hooks/api/requests/admin/passages/useGetAdminRacePassages";
import { useGetAdminRaces } from "../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { useGetAdminRaceRunners } from "../../../hooks/api/requests/admin/runners/useGetAdminRaceRunners";
import { getFastestLapsBreadcrumbs } from "../../../services/breadcrumbs/breadcrumbService";
import type { SelectOption } from "../../../types/Forms";
import { getProcessedPassagesFromPassages } from "../../../utils/passageUtils";
import { getRaceDictFromRaces } from "../../../utils/raceUtils";
import { Card } from "../../ui/Card";
import CircularLoader from "../../ui/CircularLoader";
import { Checkbox } from "../../ui/forms/Checkbox";
import Select from "../../ui/forms/Select";
import Page from "../../ui/Page";
import Pagination from "../../ui/pagination/Pagination";
import FastestLapsTable from "../../viewParts/admin/fastestLaps/FastestLapsTable";

type RunnerSortedPassages = Record<number, AdminPassageWithRunnerIdAndRaceId[]>;

type RunnerSortedProcessedPassages = Record<number, Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>>>;

const ITEMS_PER_PAGE = 100;

export default function FastestLapsAdminView(): React.ReactElement {
  const getEditionsQuery = useGetAdminEditions(true);
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetAdminRaces(true);
  const races = getRacesQuery.data?.races;
  const raceDict = React.useMemo(() => getRaceDictFromRaces(races ?? []), [races]);

  const [displayOnlyOneFastestLapPerRunner, setDisplayOnlyOneFastestLapPerRunner] = React.useState(false);
  const [selectedRaceId, setSelectedRaceId] = React.useState<number | undefined>(undefined);

  const getRunnersQuery = useGetAdminRaceRunners(selectedRaceId, true);
  const runners = getRunnersQuery.data?.runners;

  const getPassagesQuery = useGetAdminRacePassages(selectedRaceId, true);
  const passages = getPassagesQuery.data?.passages;

  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
  }, [displayOnlyOneFastestLapPerRunner]);

  const runnerSortedPassages = React.useMemo<RunnerSortedPassages | undefined>(() => {
    if (!passages) {
      return;
    }

    const sortedPassages: RunnerSortedPassages = {};

    for (const passage of passages) {
      if (passage.isHidden) {
        continue;
      }

      if (!(passage.runnerId in sortedPassages)) {
        sortedPassages[passage.runnerId] = [];
      }

      sortedPassages[passage.runnerId].push(passage);
    }

    return sortedPassages;
  }, [passages]);

  const runnerSortedProcessedPassages = React.useMemo<RunnerSortedProcessedPassages | false>(() => {
    if (!runnerSortedPassages || !races || !runners) {
      return false;
    }

    const sortedProcessedPassages: RunnerSortedProcessedPassages = {};

    for (const runnerId in runnerSortedPassages) {
      // Typecast to Number because object keys are always stringified even if they are inserted as numbers
      const runner = runners.find((ru) => ru.id === Number(runnerId));

      if (!runner) {
        // eslint-disable-next-line no-console
        console.warn(`Runner ${runnerId} not found in runners array, ignoring its passages`, runners);
        continue;
      }

      const race = races[runner.raceId];

      const runnerPassages = runnerSortedPassages[runnerId];

      sortedProcessedPassages[runnerId] = getProcessedPassagesFromPassages(race, runnerPassages);
    }

    return sortedProcessedPassages;
  }, [runnerSortedPassages, races, runners]);

  const speedSortedProcessedPassages = React.useMemo<
    Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>> | false
  >(() => {
    if (!runnerSortedProcessedPassages) {
      return false;
    }

    const sortedProcessedPassages: Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>> = [];

    for (const runnerId in runnerSortedProcessedPassages) {
      const runnerProcessedPassages = runnerSortedProcessedPassages[runnerId];

      sortedProcessedPassages.push(...runnerProcessedPassages);
    }

    return sortedProcessedPassages
      .filter((p) => p.processed.lapNumber !== null)
      .sort((p1, p2) => {
        if (p2.processed.lapSpeed > p1.processed.lapSpeed) {
          return 1;
        }

        if (
          p2.processed.lapSpeed === p1.processed.lapSpeed
          && p2.processed.lapStartRaceTime >= p1.processed.lapStartRaceTime
        ) {
          return 1;
        }

        return -1;
      });
  }, [runnerSortedProcessedPassages]);

  const passagesToDisplay = React.useMemo<Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>> | false>(() => {
    if (!speedSortedProcessedPassages) {
      return false;
    }

    let passages = [...speedSortedProcessedPassages];

    if (runners) {
      passages = passages.filter((passage) => {
        const runner = runners.find((runner) => runner.id === passage.runnerId);

        return runner?.raceId === selectedRaceId;
      });
    }

    if (displayOnlyOneFastestLapPerRunner) {
      const alreadyDisplayedRunnerIds: number[] = [];

      passages = passages.filter((passage) => {
        if (alreadyDisplayedRunnerIds.includes(passage.runnerId)) {
          return false;
        }

        alreadyDisplayedRunnerIds.push(passage.runnerId);

        return true;
      });
    }

    return passages;
  }, [speedSortedProcessedPassages, selectedRaceId, runners, displayOnlyOneFastestLapPerRunner]);

  const pageCount = React.useMemo<number>(() => {
    if (!passagesToDisplay) {
      return 1;
    }

    return Math.ceil(passagesToDisplay.length / ITEMS_PER_PAGE);
  }, [passagesToDisplay]);

  const passagesInPage = React.useMemo<Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>> | false>(() => {
    if (!passagesToDisplay) {
      return false;
    }

    const passages: Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>> = [];

    for (
      let i = ITEMS_PER_PAGE * (page - 1);
      i < Math.min(ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE, passagesToDisplay.length);
      i += 1
    ) {
      passages.push(passagesToDisplay[i]);
    }

    return passages;
  }, [passagesToDisplay, page]);

  const raceOptions = React.useMemo<Array<SelectOption<number>>>(() => {
    if (!races || !editions) {
      return [];
    }

    const editionMap = new Map<number, (typeof editions)[number]>();

    editions.forEach((edition) => {
      editionMap.set(edition.id, edition);
    });

    return Object.values(races).map((race) => {
      const edition = editionMap.get(race.editionId);

      return {
        label: `${edition ? `${edition.name} - ` : ""}${race.name}`,
        value: race.id,
      };
    });
  }, [races, editions]);

  const onSelectRace: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const raceId = Number(e.target.value);

    if (isNaN(raceId)) {
      setSelectedRaceId(undefined);
      return;
    }

    setSelectedRaceId(raceId);
  };

  return (
    <Page
      id="admin-fastest-laps"
      htmlTitle="Tours les plus rapides"
      title="Tours les plus rapides"
      breadCrumbs={getFastestLapsBreadcrumbs()}
    >
      {!races ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <div className="w-full md:w-1/2 xl:w-1/4">
            <Select
              label="Course"
              placeholderLabel="Sélectionnez une course"
              options={raceOptions}
              value={selectedRaceId}
              onChange={onSelectRace}
            />
          </div>

          {selectedRaceId !== undefined && passagesInPage === false && <CircularLoader />}

          {passagesInPage && (
            <>
              <Checkbox
                label="N'afficher que le tour le plus rapide de chaque coureur"
                checked={displayOnlyOneFastestLapPerRunner}
                onChange={(e) => {
                  setDisplayOnlyOneFastestLapPerRunner(e.target.checked);
                }}
              />

              <FastestLapsTable passages={passagesInPage} races={raceDict} runners={runners as RaceRunner[]} />

              {pageCount > 1 && (
                <div className="flex justify-center">
                  <Pagination minPage={1} maxPage={pageCount} currentPage={page} setPage={setPage} />
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </Page>
  );
}
