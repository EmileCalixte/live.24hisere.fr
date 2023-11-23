import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useIntervalApiRequest } from "../../hooks/useIntervalApiRequest";
import { getRace } from "../../services/api/RaceService";
import { appDataContext } from "../App";
import Page from "../ui/Page";
import RunnerDetailsRaceDetails from "../viewParts/runnerDetails/RunnerDetailsRaceDetails";
import RunnerSelector from "../viewParts/runnerDetails/RunnerSelector";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import RunnerDetailsStats from "../viewParts/runnerDetails/RunnerDetailsStats";
import RunnerDetailsLaps from "../viewParts/runnerDetails/RunnerDetailsLaps";
import { getDataForExcelExport } from "../../utils/runnerUtils";
import { generateXlsxFromData } from "../../utils/excelUtils";

enum Tab {
    Stats = "stats",
    Laps = "laps"
}

export default function RunnerDetailsView(): React.ReactElement {
    const { runners } = useContext(appDataContext);
    const { runnerId: urlRunnerId } = useParams();

    const [selectedRunnerId, setSelectedRunnerId] = useState(urlRunnerId);

    const [selectedTab, setSelectedTab] = useState(Tab.Stats);

    const selectedRunner = useMemo(() => {
        if (!runners || !selectedRunnerId) {
            return null;
        }

        return runners.find(runner => runner.id === Number(selectedRunnerId)) ?? null;
    }, [runners, selectedRunnerId]);

    const raceId: number | undefined = React.useMemo(() => {
        if (!selectedRunner) {
            return undefined;
        }

        return selectedRunner.raceId;
    }, [selectedRunner]);

    const fetchRace = useMemo(() => {
        if (raceId === undefined) {
            return;
        }

        return async () => getRace(raceId);
    }, [raceId]);

    const race = useIntervalApiRequest(fetchRace).json?.race;

    const onSelectRunner = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRunnerId(e.target.value);
    }, []);

    const exportRunnerToXlsx = useCallback(() => {
        if (selectedRunner === null) {
            return;
        }

        const filename = `${selectedRunner.firstname} ${selectedRunner.lastname}`.trim();

        generateXlsxFromData(getDataForExcelExport(selectedRunner), filename);
    }, [selectedRunner]);

    useEffect(() => {
        if (!selectedRunnerId || selectedRunnerId === urlRunnerId) {
            return;
        }

        // TODO better UX: use pushState instead of replaceState & handle popState event
        window.history.replaceState(window.history.state, "", `/runner-details/${selectedRunnerId}`);
    }, [selectedRunnerId, urlRunnerId]);

    return (
        <Page id="runner-details" title={selectedRunner === null ? "Détails coureur" : `Détails coureur ${selectedRunner.firstname} ${selectedRunner.lastname}`}>
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

            {selectedRunner && race &&
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
            }
        </Page>
    );
}
