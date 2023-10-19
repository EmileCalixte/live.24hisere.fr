import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getAdminPassages } from "../../../services/api/PassageService";
import { getAdminRaces } from "../../../services/api/RaceService";
import { getAdminRunners } from "../../../services/api/RunnerService";
import { type AdminPassageWithRunnerId, type ProcessedPassage } from "../../../types/Passage";
import { type RaceDict } from "../../../types/Race";
import { type Runner } from "../../../types/Runner";
import { isApiRequestResultOk } from "../../../util/apiUtils";
import { getProcessedPassagesFromPassages } from "../../../util/passageUtils";
import { getRaceDictFromRaces } from "../../../util/raceUtil";
import ToastUtil from "../../../util/ToastUtil";
import { userContext } from "../../App";
import Breadcrumbs from "../../ui/breadcrumbs/Breadcrumbs";
import Crumb from "../../ui/breadcrumbs/Crumb";
import { Checkbox } from "../../ui/forms/Checkbox";
import Page from "../../ui/Page";
import Pagination from "../../ui/pagination/Pagination";
import CircularLoader from "../../ui/CircularLoader";
import FastestLapsTable from "../../viewParts/admin/fastestLaps/FastestLapsTable";

type RunnerSortedPassages = Record<number, AdminPassageWithRunnerId[]>;

type RunnerSortedProcessedPassages = Record<number, Array<AdminPassageWithRunnerId & ProcessedPassage>>;

const ITEMS_PER_PAGE = 100;

const RUNNERS_AND_RACES_FETCH_INTERVAL = 60 * 1000;
const PASSAGES_FETCH_INTERVAL = 20 * 1000;

export default function FastestLapsAdminView(): React.ReactElement {
    const { accessToken } = useContext(userContext);

    // false = not fetched yet
    const [passages, setPassages] = useState<AdminPassageWithRunnerId[] | false>(false);

    // false = not fetched yet
    const [races, setRaces] = useState<RaceDict | false>(false);

    // false = not fetched yet
    const [runners, setRunners] = useState<Runner[] | false>(false);

    const [displayOnlyOneFastestLapPerRunner, setDisplayOnlyOneFastestLapPerRunner] = useState(false);

    const [page, setPage] = useState(1);

    const fetchRaces = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRaces(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Impossible de récupérer la liste des courses");
            return;
        }

        setRaces(getRaceDictFromRaces(result.json.races));
    }, [accessToken]);

    const fetchRunners = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminRunners(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Impossible de récupérer la liste des coureurs");
            return;
        }

        setRunners(result.json.runners);
    }, [accessToken]);

    const fetchPassages = useCallback(async () => {
        if (!accessToken) {
            return;
        }

        const result = await getAdminPassages(accessToken);

        if (!isApiRequestResultOk(result)) {
            ToastUtil.getToastr().error("Impossible de récupérer la liste des passages");
            return;
        }

        // The passages are already ordered by time
        setPassages(result.json.passages);
    }, [accessToken]);

    useEffect(() => {
        void fetchRaces();

        const interval = setInterval(() => { void fetchRaces(); }, RUNNERS_AND_RACES_FETCH_INTERVAL);

        return () => { clearInterval(interval); };
    }, [fetchRaces]);

    useEffect(() => {
        void fetchRunners();

        const interval = setInterval(() => { void fetchRunners(); }, RUNNERS_AND_RACES_FETCH_INTERVAL);

        return () => { clearInterval(interval); };
    }, [fetchRunners]);

    useEffect(() => {
        void fetchPassages();

        const interval = setInterval(() => { void fetchPassages(); }, PASSAGES_FETCH_INTERVAL);

        return () => { clearInterval(interval); };
    }, [fetchPassages]);

    useEffect(() => {
        setPage(1);
    }, [displayOnlyOneFastestLapPerRunner]);

    const runnerSortedPassages = useMemo<RunnerSortedPassages | false>(() => {
        if (!passages) {
            return false;
        }

        const sortedPassages: RunnerSortedPassages = {};

        passages.forEach(passage => {
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

    const runnerSortedProcessedPassages = useMemo<RunnerSortedProcessedPassages | false>(() => {
        if (!runnerSortedPassages || !races || !runners) {
            return false;
        }

        const sortedProcessedPassages: RunnerSortedProcessedPassages = {};

        for (const runnerId in runnerSortedPassages) {
            // Typecast to Number because object keys are always stringified even if they are inserted as numbers
            const runner = runners.find(ru => ru.id === Number(runnerId));

            if (!runner) {
                console.warn(`Runner ${runnerId} not found in runners array, ignoring its passages`, runners);
                continue;
            }

            const race = races[runner.raceId];

            if (!race) {
                console.warn(`Race ${runner.raceId} not found in races object, ignoring passages of runner ${runner.id}`, races);
                continue;
            }

            const runnerPassages = runnerSortedPassages[runnerId];

            sortedProcessedPassages[runnerId] = getProcessedPassagesFromPassages(runnerPassages, race);
        }

        return sortedProcessedPassages;
    }, [runnerSortedPassages, races, runners]);

    const speedSortedProcessedPassages = useMemo<Array<AdminPassageWithRunnerId & ProcessedPassage> | false>(() => {
        if (!runnerSortedProcessedPassages) {
            return false;
        }

        const sortedProcessedPassages: Array<AdminPassageWithRunnerId & ProcessedPassage> = [];

        for (const runnerId in runnerSortedProcessedPassages) {
            const runnerProcessedPassages = runnerSortedProcessedPassages[runnerId];

            sortedProcessedPassages.push(...runnerProcessedPassages);
        }

        return sortedProcessedPassages
            .filter(p => p.processed.lapNumber !== null)
            .sort((p1, p2) => {
                if (p2.processed.lapSpeed > p1.processed.lapSpeed) {
                    return 1;
                }

                if (p2.processed.lapSpeed === p1.processed.lapSpeed && p2.processed.lapStartRaceTime >= p1.processed.lapStartRaceTime) {
                    return 1;
                }

                return -1;
            });
    }, [runnerSortedProcessedPassages]);

    const passagesToDisplay = useMemo<Array<AdminPassageWithRunnerId & ProcessedPassage> | false>(() => {
        if (!speedSortedProcessedPassages) {
            return false;
        }

        let passages = [...speedSortedProcessedPassages];

        if (displayOnlyOneFastestLapPerRunner) {
            const alreadyDisplayedRunnerIds: number[] = [];

            passages = passages.filter(passage => {
                if (alreadyDisplayedRunnerIds.includes(passage.runnerId)) {
                    return false;
                }

                alreadyDisplayedRunnerIds.push(passage.runnerId);

                return true;
            });
        }

        return passages;
    }, [speedSortedProcessedPassages, displayOnlyOneFastestLapPerRunner]);

    const pageCount = useMemo<number>(() => {
        if (!passagesToDisplay) {
            return 1;
        }

        return Math.ceil(passagesToDisplay.length / ITEMS_PER_PAGE);
    }, [passagesToDisplay]);

    const passagesInPage = useMemo<Array<AdminPassageWithRunnerId & ProcessedPassage> | false>(() => {
        if (!passagesToDisplay) {
            return false;
        }

        const passages: Array<AdminPassageWithRunnerId & ProcessedPassage> = [];

        for (let i = ITEMS_PER_PAGE * (page - 1); i < Math.min(ITEMS_PER_PAGE * (page - 1) + ITEMS_PER_PAGE, passagesToDisplay.length); ++i) {
            passages.push(passagesToDisplay[i]);
        }

        return passages;
    }, [passagesToDisplay, page]);

    return (
        <Page id="admin-fastest-laps" title="Tours les plus rapides">
            <Row>
                <Col>
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Tours les plus rapides" />
                    </Breadcrumbs>
                </Col>
            </Row>

            {passagesInPage === false &&
                <Row>
                    <Col>
                        <CircularLoader />
                    </Col>
                </Row>
            }

            {passagesInPage !== false &&
                <>
                    <Row>
                        <Col className="mb-3">
                            <Checkbox label="N'afficher que le tour le plus rapide de chaque coureur"
                                      checked={displayOnlyOneFastestLapPerRunner}
                                      onChange={e => { setDisplayOnlyOneFastestLapPerRunner(e.target.checked); }}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <FastestLapsTable passages={passagesInPage}
                                              races={races as RaceDict}
                                              runners={runners as Runner[]}
                            />
                        </Col>
                    </Row>

                    {pageCount > 1 &&
                        <Row>
                            <Col className="mt-3 pagination-container">
                                <Pagination minPage={1} maxPage={pageCount} currentPage={page} setPage={setPage} />
                            </Col>
                        </Row>
                    }
                </>
            }
        </Page>
    );
}
