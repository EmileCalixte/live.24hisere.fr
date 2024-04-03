import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
    RUNNER_LAPS_TABLE_SEARCH_PARAMS,
    RUNNER_SPEED_CHART_SEARCH_PARAMS,
} from "../../constants/searchParams";
import { useTabQueryString } from "../../hooks/queryString/useTabQueryString";
import { useIntervalApiRequest } from "../../hooks/useIntervalApiRequest";
import { useQueryString } from "../../hooks/queryString/useQueryString";
import { useRanking } from "../../hooks/useRanking";
import { getRace } from "../../services/api/RaceService";
import { getRaceRunners, getRunners } from "../../services/api/RunnerService";
import {
    type RunnerWithProcessedData,
    type RunnerWithProcessedHours,
    type RunnerWithProcessedPassages,
} from "../../types/Runner";
import {
    getProcessedHoursFromPassages,
    getProcessedPassagesFromPassages,
    getRunnerProcessedDataFromPassages,
} from "../../utils/passageUtils";
import CircularLoader from "../ui/CircularLoader";
import Page from "../ui/Page";
import RunnerDetailsRaceDetails from "../viewParts/runnerDetails/RunnerDetailsRaceDetails";
import RunnerSelector from "../viewParts/runnerDetails/RunnerSelector";
import React from "react";
import RunnerDetailsStats from "../viewParts/runnerDetails/RunnerDetailsStats";
import RunnerDetailsLaps from "../viewParts/runnerDetails/RunnerDetailsLaps";
import { getDataForExcelExport } from "../../utils/runnerUtils";
import { generateXlsxFromData } from "../../utils/excelUtils";

const enum Tab {
    Stats = "stats",
    Laps = "laps",
}

export default function RunnerDetailsView(): React.ReactElement {
    const { runnerId } = useParams();

    const navigate = useNavigate();

    const { deleteParams, prefixedQueryString } = useQueryString();
    const { selectedTab, setTabParam } = useTabQueryString([Tab.Stats, Tab.Laps], Tab.Stats);

    const runners = useIntervalApiRequest(getRunners).json?.runners;

    const raceId: number | undefined = React.useMemo(() => {
        if (runnerId === undefined) {
            return undefined;
        }

        return runners?.find(runner => runner.id.toString() === runnerId)?.raceId;
    }, [runnerId, runners]);

    const fetchRace = React.useMemo(() => {
        if (raceId === undefined) {
            return;
        }

        return async () => getRace(raceId);
    }, [raceId]);

    const race = useIntervalApiRequest(fetchRace).json?.race;

    const fetchRaceRunners = React.useMemo(() => {
        if (raceId === undefined) {
            return;
        }

        return async () => getRaceRunners(raceId);
    }, [raceId]);

    const raceRunners = useIntervalApiRequest(fetchRaceRunners).json?.runners;

    const processedRaceRunners = React.useMemo<Array<RunnerWithProcessedPassages & RunnerWithProcessedHours & RunnerWithProcessedData> | undefined>(() => {
        if (!raceRunners || !race) {
            return;
        }

        return raceRunners.map(runner => {
            const processedPassages = getProcessedPassagesFromPassages(race, runner.passages);

            return {
                ...runner,
                ...getRunnerProcessedDataFromPassages(race, runner.passages),
                passages: processedPassages,
                hours: getProcessedHoursFromPassages(race, processedPassages),
            };
        });
    }, [raceRunners, race]);

    const ranking = useRanking(race, processedRaceRunners);

    const selectedRunner = React.useMemo(() => {
        return ranking?.find(rankingRunner => rankingRunner.id.toString() === runnerId);
    }, [ranking, runnerId]);

    const onSelectRunner = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(`/runner-details/${e.target.value}${prefixedQueryString}`);
    }, [navigate, prefixedQueryString]);

    const exportRunnerToXlsx = React.useCallback(() => {
        if (!selectedRunner) {
            return;
        }

        const filename = `${selectedRunner.firstname} ${selectedRunner.lastname}`.trim();

        generateXlsxFromData(getDataForExcelExport(selectedRunner), filename);
    }, [selectedRunner]);

    React.useEffect(() => {
        if (!runners || runnerId === undefined) {
            return;
        }

        if (runners.find(runner => runner.id.toString() === runnerId) === undefined) {
            navigate("/runner-details");
        }
    }, [runners, runnerId, navigate, prefixedQueryString]);

    React.useEffect(() => {
        if (selectedTab !== Tab.Laps) {
            deleteParams(RUNNER_LAPS_TABLE_SEARCH_PARAMS, { replace: true });
        }

        if (selectedTab !== Tab.Stats) {
            deleteParams(RUNNER_SPEED_CHART_SEARCH_PARAMS, { replace: true });
        }
    }, [deleteParams, selectedTab]);

    return (
        <Page id="runner-details" title={selectedRunner === undefined ? "Détails coureur" : `Détails coureur ${selectedRunner.firstname} ${selectedRunner.lastname}`}>
            <Row className="hide-on-print">
                <Col>
                    <h1>Détails coureur</h1>
                </Col>
            </Row>

            <Row className="hide-on-print">
                <Col>
                    <RunnerSelector runners={runners}
                                    onSelectRunner={onSelectRunner}
                                    selectedRunnerId={runnerId}
                    />
                </Col>
            </Row>

            {selectedRunner && race ? (
                <>
                    <Row className="mt-3">
                        <Col className="mb-3">
                            <button className="a" onClick={exportRunnerToXlsx}>
                                <FontAwesomeIcon icon={faFileExcel} /> Générer un fichier Excel
                            </button>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <div className="runner-details-data-container">
                                <ul className="tabs-container">
                                    <li className={selectedTab === Tab.Stats ? "active" : ""}>
                                        <button onClick={() => { setTabParam(Tab.Stats); }}>Statistiques</button>
                                    </li>
                                    <li className={selectedTab === Tab.Laps ? "active" : ""}>
                                        <button onClick={() => { setTabParam(Tab.Laps); }}>Détails des tours</button>
                                    </li>
                                </ul>

                                <div className="card">
                                    {(() => {
                                        switch (selectedTab) {
                                            case Tab.Stats:
                                                return (
                                                    <>
                                                        <RunnerDetailsRaceDetails race={race} />
                                                        {ranking
                                                            ? <RunnerDetailsStats runner={selectedRunner} race={race} ranking={ranking} />
                                                            : <CircularLoader />
                                                        }
                                                    </>
                                                );
                                            case Tab.Laps:
                                                return <RunnerDetailsLaps runner={selectedRunner} race={race} />;
                                            default:
                                                return null;
                                        }
                                    })()}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    {runnerId !== undefined && (
                        <Row className="mt-3">
                            <Col>
                                <CircularLoader asideText="Chargement des données" />
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </Page>
    );
}
