import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { type ProcessedRanking, type Ranking, type RankingRunnerRanks } from "../../types/Ranking";
import {
    type Runner,
    type RunnerWithPassages,
    type RunnerWithProcessedHours,
    type RunnerWithProcessedPassages,
    type RunnerWithRace,
} from "../../types/Runner";
import { RankingProcesser } from "../../util/RankingProcesser";
import Page from "../ui/Page";
import RunnerDetailsRaceDetails from "../pageParts/runnerDetails/RunnerDetailsRaceDetails";
import RunnerSelector from "../pageParts/runnerDetails/RunnerSelector";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { performAPIRequest } from "../../util/apiUtils";
import RunnerDetailsStats from "../pageParts/runnerDetails/RunnerDetailsStats";
import RunnerDetailsLaps from "../pageParts/runnerDetails/RunnerDetailsLaps";
import {
    getDataForExcelExport,
    getRunnerProcessedHours,
    getRunnerProcessedPassages,
} from "../../util/RunnerDetailsUtil";
import { generateXlsxFromData } from "../../util/excelUtils";

enum Tab {
    Stats = "stats",
    Laps = "laps"
}

export const RUNNER_UPDATE_INTERVAL_TIME = 20 * 1000;
export const RANKING_UPDATE_INTERVAL_TIME = 20 * 1000;

export default function RunnerDetails(): JSX.Element {
    const { runnerId: urlRunnerId } = useParams();

    const [selectedRunnerId, setSelectedRunnerId] = useState(urlRunnerId);
    const [selectedRunner, setSelectedRunner] = useState<RunnerWithRace & RunnerWithProcessedPassages & RunnerWithProcessedHours | null>(null);

    const [runners, setRunners] = useState<Runner[] | false>(false);

    const [processedRanking, setProcessedRanking] = useState<ProcessedRanking | false>(false);

    const [selectedTab, setSelectedTab] = useState(Tab.Stats);

    const fetchRunners = useCallback(async () => {
        const response = await performAPIRequest("/runners");
        const responseJson = await response.json();

        setRunners(responseJson.runners);
    }, []);

    const fetchRanking = useCallback(async () => {
        if (!selectedRunner) {
            setProcessedRanking(false);
            return;
        }

        const response = await performAPIRequest(`/ranking/${selectedRunner.raceId}`);
        const responseJson = await response.json();

        setProcessedRanking(new RankingProcesser(selectedRunner.race, responseJson.ranking as Ranking).getProcessedRanking());
    }, [selectedRunner]);

    const fetchSelectedRunner = useCallback(async () => {
        if (!selectedRunnerId) {
            return;
        }

        const response = await performAPIRequest(`/runners/${selectedRunnerId}`);

        if (!response.ok) {
            console.error("Failed to fetch runner", await response.json());
            setSelectedRunner(null);
            return;
        }

        const responseJson = await response.json();
        const runner = responseJson.runner as RunnerWithRace & RunnerWithPassages;

        runner.passages.sort((passageA, passageB) => {
            const passageADate = new Date(passageA.time);
            const passageBDate = new Date(passageB.time);

            if (passageADate.getTime() < passageBDate.getTime()) {
                return -1;
            }

            if (passageADate.getTime() > passageBDate.getTime()) {
                return 1;
            }

            return 0;
        });

        const processedPassages = getRunnerProcessedPassages(runner.passages, runner.race);

        const runnerWithProcessedPassages = {
            ...runner,
            passages: processedPassages,
        };

        setSelectedRunner({
            ...runnerWithProcessedPassages,
            hours: getRunnerProcessedHours(runnerWithProcessedPassages, runner.race),
        });
    }, [selectedRunnerId]);

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
        void fetchRunners();
    }, [fetchRunners]);

    useEffect(() => {
        void fetchSelectedRunner();

        const refreshRunnerInterval = setInterval(() => { void fetchSelectedRunner(); }, RUNNER_UPDATE_INTERVAL_TIME);
        return () => { clearInterval(refreshRunnerInterval); };
    }, [fetchSelectedRunner]);

    useEffect(() => {
        void fetchRanking();

        const refreshRankingInterval = setInterval(() => { void fetchRanking(); }, RANKING_UPDATE_INTERVAL_TIME);
        return () => { clearInterval(refreshRankingInterval); };
    }, [fetchRanking]);

    useEffect(() => {
        if (!selectedRunnerId || selectedRunnerId === urlRunnerId) {
            return;
        }

        // TODO better UX: use pushState instead of replaceState & handle popState event
        window.history.replaceState(window.history.state, "", `/runner-details/${selectedRunnerId}`);
    }, [selectedRunnerId, urlRunnerId]);

    const ranks = useMemo<RankingRunnerRanks | null>(() => {
        if (!selectedRunner || !processedRanking) {
            return null;
        }

        const rankingRunner = processedRanking.find(runner => {
            return runner.id === selectedRunner.id;
        });

        if (!rankingRunner) {
            return null;
        }

        return rankingRunner.rankings;
    }, [processedRanking, selectedRunner]);

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

            {selectedRunner !== null &&
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
                                                        <RunnerDetailsRaceDetails race={selectedRunner.race} />
                                                        <RunnerDetailsStats runner={selectedRunner} race={selectedRunner.race} ranks={ranks} />
                                                    </>
                                                );
                                            case Tab.Laps:
                                                return <RunnerDetailsLaps runner={selectedRunner} />;
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
