import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {AdminPassageWithRunnerId, ProcessedPassage} from "../../../../types/Passage";
import {AdminRaceDict} from "../../../../types/Race";
import Runner from "../../../../types/Runner";
import ApiUtil from "../../../../util/ApiUtil";
import RunnerDetailsUtil from "../../../../util/RunnerDetailsUtil";
import {userContext} from "../../../App";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import Pagination from "../../../layout/pagination/Pagination";
import CircularLoader from "../../../misc/CircularLoader";
import FastestLapsTable from "./FastestLapsTable";

type RunnerSortedPassages = {
    [runnerId: number]: AdminPassageWithRunnerId[];
}

type RunnerSortedProcessedPassages = {
    [runnerId: number]: (AdminPassageWithRunnerId & ProcessedPassage)[];
}

const ITEMS_PER_PAGE = 100;

const FastestLaps = () => {
    const {accessToken} = useContext(userContext);

    // false = not fetched yet
    const [passages, setPassages] = useState<AdminPassageWithRunnerId[] | false>(false);

    // false = not fetched yet
    const [races, setRaces] = useState<AdminRaceDict | false>(false);

    // false = not fetched yet
    const [runners, setRunners] = useState<Runner[] | false>(false);

    const [page, setPage] = useState(1);

    const fetchRunnersAndRaces = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/runners', accessToken);
        const responseJson = await response.json();

        setRunners(responseJson.runners);
        setRaces(responseJson.races);
    }, [accessToken]);

    const fetchPassages = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/passages', accessToken);
        const responseJson = await response.json();

        // The passages are already ordered by time
        setPassages(responseJson.passages);
    }, [accessToken]);

    useEffect(() => {
        fetchRunnersAndRaces();
    }, [fetchRunnersAndRaces]);

    useEffect(() => {
        fetchPassages();
    }, [fetchPassages]);

    const runnerSortedPassages = useMemo<RunnerSortedPassages | false>(() => {
        if (!passages) {
            return false;
        }

        const sortedPassages: RunnerSortedPassages = {};

        passages.reduce((accumulator, currentValue) => {
            if (currentValue.isHidden) {
                return sortedPassages;
            }

            if (!(currentValue.runnerId in sortedPassages)) {
                sortedPassages[currentValue.runnerId] = [];
            }

            sortedPassages[currentValue.runnerId].push(currentValue);

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

            sortedProcessedPassages[runnerId] = RunnerDetailsUtil.getRunnerProcessedPassages(runnerPassages, race);
        }

        return sortedProcessedPassages;
    }, [runnerSortedPassages, races, runners]);

    const speedSortedProcessedPassages = useMemo<(AdminPassageWithRunnerId & ProcessedPassage)[] | false>(() => {
        if (!runnerSortedProcessedPassages) {
            return false;
        }

        const sortedProcessedPassages: (AdminPassageWithRunnerId & ProcessedPassage)[] = [];

        for (const runnerId in runnerSortedProcessedPassages) {
            const runnerProcessedPassages = runnerSortedProcessedPassages[runnerId];

            sortedProcessedPassages.push(...runnerProcessedPassages);
        }

        return sortedProcessedPassages
            .filter(p => p.processed.lapNumber !== null)
            .sort((p1, p2) => {
                if (p2.processed.lapSpeed >= p1.processed.lapSpeed) {
                    return 1;
                }

                return -1;
            });
    }, [runnerSortedProcessedPassages]);

    const passagesToDisplay = useMemo<(AdminPassageWithRunnerId & ProcessedPassage)[] | false>(() => {
        if (!speedSortedProcessedPassages) {
            return false;
        }

        // TODO filters

        return speedSortedProcessedPassages;
    }, [speedSortedProcessedPassages]);

    const pageCount = useMemo<number>(() => {
        if (!passagesToDisplay) {
            return 1;
        }

        return Math.floor(passagesToDisplay.length / ITEMS_PER_PAGE);
    }, [passagesToDisplay]);

    const passagesInPage = useMemo<(AdminPassageWithRunnerId & ProcessedPassage)[] | false>(() => {
        if (!passagesToDisplay) {
            return false;
        }

        const passages: (AdminPassageWithRunnerId & ProcessedPassage)[] = [];

        for (let i = ITEMS_PER_PAGE * page; i < Math.min(ITEMS_PER_PAGE * page + ITEMS_PER_PAGE, passagesToDisplay.length); ++i) {
            passages.push(passagesToDisplay[i]);
        }

        return passages;
    }, [passagesToDisplay, page]);

    return (
        <div id="page-admin-fastest-laps">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Tours les plus rapides" />
                    </Breadcrumbs>
                </div>
            </div>

            <div className="row">

                {passagesInPage === false &&
                    <div className="col-12">
                        <CircularLoader/>
                    </div>
                }

                {passagesInPage !== false &&
                    <>
                        <div className="col-12">
                            <FastestLapsTable passages={passagesInPage}
                                              races={races as AdminRaceDict}
                                              runners={runners as Runner[]}
                            />
                        </div>

                        {pageCount > 1 &&
                            <div className="col-12 mt-3 pagination-container">
                                <Pagination minPage={1} maxPage={pageCount} currentPage={page} setPage={setPage}/>
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    )
}

export default FastestLaps;
