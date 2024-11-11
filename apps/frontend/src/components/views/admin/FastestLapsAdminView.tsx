import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  type AdminPassageWithRunnerId,
  type ProcessedPassage,
  type RaceDict,
  type RaceRunner,
} from "@live24hisere/core/types";
import { getAdminPassages } from "../../../services/api/passageService";
import { getAdminRaces } from "../../../services/api/raceService";
import { getAdminRunners } from "../../../services/api/runnerService";
import { getFastestLapsBreadcrumbs } from "../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../services/ToastService";
import { type SelectOption } from "../../../types/Forms";
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

type RunnerSortedPassages = Record<number, AdminPassageWithRunnerId[]>;

type RunnerSortedProcessedPassages = Record<number, Array<ProcessedPassage<AdminPassageWithRunnerId>>>;

const ITEMS_PER_PAGE = 100;

const RUNNERS_AND_RACES_FETCH_INTERVAL = 60 * 1000;
const PASSAGES_FETCH_INTERVAL = 20 * 1000;

export default function FastestLapsAdminView(): React.ReactElement {
  const { accessToken } = React.useContext(appContext).user;

  // false = not fetched yet
  const [passages, setPassages] = React.useState<AdminPassageWithRunnerId[] | false>(false);

  // false = not fetched yet
  const [races, setRaces] = React.useState<RaceDict | false>(false);

  // false = not fetched yet
  const [runners, setRunners] = React.useState<RaceRunner[] | false>(false);

  const [displayOnlyOneFastestLapPerRunner, setDisplayOnlyOneFastestLapPerRunner] = React.useState(false);
  const [selectedRaceId, setSelectedRaceId] = React.useState<number | "ALL">("ALL");

  const [page, setPage] = React.useState(1);

  const fetchRaces = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRaces(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des courses");
      return;
    }

    setRaces(getRaceDictFromRaces(result.json.races));
  }, [accessToken]);

  const fetchRunners = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminRunners(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des coureurs");
      return;
    }

    setRunners(result.json.runners);
  }, [accessToken]);

  const fetchPassages = React.useCallback(async () => {
    if (!accessToken) {
      return;
    }

    const result = await getAdminPassages(accessToken);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer la liste des passages");
      return;
    }

    // The passages are already ordered by time
    setPassages(result.json.passages);
  }, [accessToken]);

  React.useEffect(() => {
    void fetchRaces();

    const interval = setInterval(() => {
      void fetchRaces();
    }, RUNNERS_AND_RACES_FETCH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [fetchRaces]);

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

      if (!race) {
        console.warn(
          `Race ${runner.raceId} not found in races object, ignoring passages of runner ${runner.id}`,
          races,
        );
        continue;
      }

      const runnerPassages = runnerSortedPassages[runnerId];

      sortedProcessedPassages[runnerId] = getProcessedPassagesFromPassages(race, runnerPassages);
    }

    return sortedProcessedPassages;
  }, [runnerSortedPassages, races, runners]);

  const speedSortedProcessedPassages = React.useMemo<Array<ProcessedPassage<AdminPassageWithRunnerId>> | false>(() => {
    if (!runnerSortedProcessedPassages) {
      return false;
    }

    const sortedProcessedPassages: Array<ProcessedPassage<AdminPassageWithRunnerId>> = [];

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

  const passagesToDisplay = React.useMemo<Array<ProcessedPassage<AdminPassageWithRunnerId>> | false>(() => {
    if (!speedSortedProcessedPassages) {
      return false;
    }

    let passages = [...speedSortedProcessedPassages];

    if (selectedRaceId !== "ALL" && runners) {
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

  const passagesInPage = React.useMemo<Array<ProcessedPassage<AdminPassageWithRunnerId>> | false>(() => {
    if (!passagesToDisplay) {
      return false;
    }

    const passages: Array<ProcessedPassage<AdminPassageWithRunnerId>> = [];

    for (
      let i = ITEMS_PER_PAGE * (page - 1);
      i < Math.min(ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE, passagesToDisplay.length);
      ++i
    ) {
      passages.push(passagesToDisplay[i]);
    }

    return passages;
  }, [passagesToDisplay, page]);

  const raceOptions = React.useMemo<Array<SelectOption<number | "ALL">>>(() => {
    const allOption: SelectOption<"ALL"> = {
      label: "Toutes les courses",
      value: "ALL",
    };

    if (!races) {
      return [allOption];
    }

    return [
      allOption,
      ...Object.values(races).map((race) => ({
        label: race.name,
        value: race.id,
      })),
    ];
  }, [races]);

  const onSelectRace: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const raceId = Number(e.target.value);

    if (isNaN(raceId)) {
      setSelectedRaceId("ALL");
      return;
    }

    setSelectedRaceId(raceId);
  };

  return (
    <Page id="admin-fastest-laps" title="Tours les plus rapides">
      <Row>
        <Col>{getFastestLapsBreadcrumbs()}</Col>
      </Row>

      {passagesInPage === false && (
        <Row>
          <Col>
            <CircularLoader />
          </Col>
        </Row>
      )}

      {passagesInPage !== false && (
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

          <Row className="mb-3">
            <Col xxl={2} xl={3} lg={4} md={6} sm={12}>
              <Select label="Course" options={raceOptions} value={selectedRaceId} onChange={onSelectRace} />
            </Col>
          </Row>

          <Row>
            <Col>
              <FastestLapsTable passages={passagesInPage} races={races as RaceDict} runners={runners as RaceRunner[]} />
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
    </Page>
  );
}
