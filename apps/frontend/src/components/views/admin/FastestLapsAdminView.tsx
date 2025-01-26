import React from "react";
import { Col, Row } from "react-bootstrap";
import type {
  AdminPassageWithRunnerIdAndRaceId,
  AdminRunner,
  ProcessedPassage,
  RaceRunner,
} from "@live24hisere/core/types";
import { useGetAdminEditions } from "../../../hooks/api/requests/admin/editions/useGetAdminEditions";
import { useGetAdminRaces } from "../../../hooks/api/requests/admin/races/useGetAdminRaces";
import { getAdminRacePassages } from "../../../services/api/passageService";
import { getAdminRaceRunners } from "../../../services/api/runnerService";
import { getFastestLapsBreadcrumbs } from "../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../services/ToastService";
import type { SelectOption } from "../../../types/Forms";
import { isApiRequestResultOk } from "../../../utils/apiUtils";
import { getProcessedPassagesFromPassages } from "../../../utils/passageUtils";
import { getRaceDictFromRaces } from "../../../utils/raceUtils";
import { appContext } from "../../App";
import CircularLoader from "../../ui/CircularLoader";
import { Checkbox } from "../../ui/forms/Checkbox";
import Select from "../../ui/forms/Select";
import Page from "../../ui/Page";
import Pagination from "../../ui/pagination/Pagination";
import FastestLapsTable from "../../viewParts/admin/fastestLaps/FastestLapsTable";

type RunnerSortedPassages = Record<number, AdminPassageWithRunnerIdAndRaceId[]>;

type RunnerSortedProcessedPassages = Record<number, Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>>>;

const ITEMS_PER_PAGE = 100;

const RUNNERS_AND_RACES_FETCH_INTERVAL = 60 * 1000;
const PASSAGES_FETCH_INTERVAL = 20 * 1000;

export default function FastestLapsAdminView(): React.ReactElement {
  const { accessToken } = React.useContext(appContext).user;

  // false = not fetched yet
  const [passages, setPassages] = React.useState<AdminPassageWithRunnerIdAndRaceId[] | false>(false);

  const getEditionsQuery = useGetAdminEditions(true);
  const editions = getEditionsQuery.data?.editions;

  const getRacesQuery = useGetAdminRaces(true);
  const races = getRacesQuery.data?.races;
  const raceDict = React.useMemo(() => getRaceDictFromRaces(races ?? []), [races]);

  // false = not fetched yet
  const [runners, setRunners] = React.useState<Array<RaceRunner<AdminRunner>> | false>(false);

  const [displayOnlyOneFastestLapPerRunner, setDisplayOnlyOneFastestLapPerRunner] = React.useState(false);
  const [selectedRaceId, setSelectedRaceId] = React.useState<number | undefined>(undefined);

  const [page, setPage] = React.useState(1);

  const fetchRunners = React.useCallback(async () => {
    if (!accessToken || selectedRaceId === undefined) {
      return;
    }

    const result = await getAdminRaceRunners(accessToken, selectedRaceId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des coureurs");
      return;
    }

    setRunners(result.json.runners);
  }, [accessToken, selectedRaceId]);

  const fetchPassages = React.useCallback(async () => {
    if (!accessToken || selectedRaceId === undefined) {
      return;
    }

    setPassages(false);

    const result = await getAdminRacePassages(accessToken, selectedRaceId);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des passages de la course sélectionnée");
      return;
    }

    // The passages are already ordered by time
    setPassages(result.json.passages);
  }, [accessToken, selectedRaceId]);

  React.useEffect(() => {
    void fetchRunners();

    const interval = setInterval(() => {
      void fetchRunners();
    }, RUNNERS_AND_RACES_FETCH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchRunners]);

  React.useEffect(() => {
    void fetchPassages();

    const interval = setInterval(() => {
      void fetchPassages();
    }, PASSAGES_FETCH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchPassages]);

  React.useEffect(() => {
    setPage(1);
  }, [displayOnlyOneFastestLapPerRunner]);

  const runnerSortedPassages = React.useMemo<RunnerSortedPassages | false>(() => {
    if (!passages) {
      return false;
    }

    const sortedPassages: RunnerSortedPassages = {};

    passages.forEach((passage) => {
      if (passage.isHidden) {
        return sortedPassages;
      }

      if (!(passage.runnerId in sortedPassages)) {
        sortedPassages[passage.runnerId] = [];
      }

      sortedPassages[passage.runnerId].push(passage);

      return sortedPassages;
    }, sortedPassages);

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
          p2.processed.lapSpeed === p1.processed.lapSpeed &&
          p2.processed.lapStartRaceTime >= p1.processed.lapStartRaceTime
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
      ++i
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
    <Page id="admin-fastest-laps" title="Tours les plus rapides">
      <Row>
        <Col>{getFastestLapsBreadcrumbs()}</Col>
      </Row>

      {races ? (
        <>
          <Row className="mb-3">
            <Col xxl={2} xl={3} lg={4} md={6} sm={12}>
              <Select
                label="Course"
                placeholderLabel="Sélectionnez une course"
                options={raceOptions}
                value={selectedRaceId}
                onChange={onSelectRace}
              />
            </Col>
          </Row>

          {selectedRaceId !== undefined && passagesInPage === false && <CircularLoader />}

          {passagesInPage && (
            <>
              <Row className="mb-3">
                <Col>
                  <Checkbox
                    label="N'afficher que le tour le plus rapide de chaque coureur"
                    checked={displayOnlyOneFastestLapPerRunner}
                    onChange={(e) => {
                      setDisplayOnlyOneFastestLapPerRunner(e.target.checked);
                    }}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FastestLapsTable passages={passagesInPage} races={raceDict} runners={runners as RaceRunner[]} />
                </Col>
              </Row>

              {pageCount > 1 && (
                <Row>
                  <Col className="mt-3 pagination-container">
                    <Pagination minPage={1} maxPage={pageCount} currentPage={page} setPage={setPage} />
                  </Col>
                </Row>
              )}
            </>
          )}
        </>
      ) : (
        <CircularLoader />
      )}
    </Page>
  );
}
