import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useIntervalApiRequest } from "../../hooks/useIntervalApiRequest";
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
    const { runnerId: urlRunnerId } = useParams();

    const [selectedTab, setSelectedTab] = React.useState(Tab.Stats);

    const runners = useIntervalApiRequest(getRunners).json?.runners;

    const [selectedRunnerId, setSelectedRunnerId] = React.useState(urlRunnerId);

    const raceId: number | undefined = React.useMemo(() => {
        if (selectedRunnerId === undefined) {
            return undefined;
        }

        return runners?.find(runner => runner.id.toString() === selectedRunnerId)?.raceId;
    }, [selectedRunnerId, runners]);

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
        return ranking?.find(rankingRunner => rankingRunner.id.toString() === selectedRunnerId);
    }, [ranking, selectedRunnerId]);

    const onSelectRunner = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRunnerId(e.target.value);
    }, []);

    const exportRunnerToXlsx = React.useCallback(() => {
        if (!selectedRunner) {
            return;
        }

        const filename = `${selectedRunner.firstname} ${selectedRunner.lastname}`.trim();

        generateXlsxFromData(getDataForExcelExport(selectedRunner), filename);
    }, [selectedRunner]);

    React.useEffect(() => {
        if (!selectedRunnerId || selectedRunnerId === urlRunnerId) {
            return;
        }

        // TODO better UX: use pushState instead of replaceState & handle popState event
        window.history.replaceState(window.history.state, "", `/runner-details/${selectedRunnerId}`);
    }, [selectedRunnerId, urlRunnerId]);

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
                                    selectedRunnerId={selectedRunnerId}
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
                                        <button onClick={() => { setSelectedTab(Tab.Stats); }}>Statistiques</button>
                                    </li>
                                    <li className={selectedTab === Tab.Laps ? "active" : ""}>
                                        <button onClick={() => { setSelectedTab(Tab.Laps); }}>Détails des tours</button>
                                    </li>
                                </ul>

                                <div className="runner-details-data">
                                    {(() => {
                                        switch (selectedTab) {
                                            case Tab.Stats:
                                                return (
                                                    <>
                                                        <RunnerDetailsRaceDetails race={race} />
                                                        <RunnerDetailsStats runner={selectedRunner} race={race} ranks={selectedRunner.ranks} />
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
                    {selectedRunnerId !== undefined &&
                        <Row className="mt-3">
                            <Col>
                                <CircularLoader asideText="Chargement des données" />
                            </Col>
                        </Row>
                    }
                </>
            )}
        </Page>
    );
}
