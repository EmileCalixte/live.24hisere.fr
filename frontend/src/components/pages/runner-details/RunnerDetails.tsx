import {useParams} from "react-router-dom";
import {type ProcessedRanking, type Ranking as RankingType, type RankingRunnerRanks} from "../../../types/Ranking";
import {RankingProcesser} from "../../../util/RankingProcesser";
import RunnerDetailsRaceDetails from "./RunnerDetailsRaceDetails";
import RunnerSelector from "./RunnerSelector";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {performAPIRequest} from "../../../util/apiUtils";
import RunnerDetailsStats from "./RunnerDetailsStats";
import RunnerDetailsLaps from "./RunnerDetailsLaps";
import {
    getDataForExcelExport,
    getRunnerProcessedHours,
    getRunnerProcessedPassages,
} from "../../../util/RunnerDetailsUtil";
import {generateXlsxFromData} from "../../../util/excelUtils";
import type Runner from "../../../types/Runner";
import {
    type RunnerWithPassages,
    type RunnerWithProcessedHours,
    type RunnerWithProcessedPassages,
    type RunnerWithRace,
} from "../../../types/Runner";

enum Tab {
    Stats = "stats",
    Laps = "laps",
}

export const RUNNER_UPDATE_INTERVAL_TIME = 30000;
export const RANKING_UPDATE_INTERVAL_TIME = 30000;

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

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

        setProcessedRanking(new RankingProcesser(selectedRunner.race, responseJson.ranking as RankingType).getProcessedRanking());
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
        fetchRunners();
    }, [fetchRunners]);

    useEffect(() => {
        fetchSelectedRunner();

        const refreshRunnerInterval = setInterval(fetchSelectedRunner, RUNNER_UPDATE_INTERVAL_TIME);
        return () => clearInterval(refreshRunnerInterval);
    }, [fetchSelectedRunner]);

    useEffect(() => {
        fetchRanking();

        const refreshRankingInterval = setInterval(fetchRanking, RANKING_UPDATE_INTERVAL_TIME);
        return () => clearInterval(refreshRankingInterval);
    }, [fetchRanking]);

    useEffect(() => {
        if (selectedRunnerId === urlRunnerId) {
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
        <div id="page-runner-details">
            <div className="row hide-on-print">
                <div className="col-12">
                    <h1>Détails coureur</h1>
                </div>
            </div>

            <div className="row hide-on-print">
                <div className="col-12">
                    <RunnerSelector runners={runners}
                                    onSelectRunner={onSelectRunner}
                                    selectedRunnerId={selectedRunnerId}
                    />
                </div>
            </div>

            {selectedRunner !== null &&
                <div className="row mt-3">
                    <div className="col-12 mb-3">
                        <button className="a" onClick={exportRunnerToXlsx}>
                            <i className="fa-solid fa-file-excel"/> Générer un fichier Excel
                        </button>
                    </div>

                    <div className="col-12">
                        <div className="runner-details-data-container">
                            <ul className="tabs-container">
                                <li className={selectedTab === Tab.Stats ? "active" : ""}>
                                    <button onClick={() => setSelectedTab(Tab.Stats)}>Statistiques</button>
                                </li>
                                <li className={selectedTab === Tab.Laps ? "active" : ""}>
                                    <button onClick={() => setSelectedTab(Tab.Laps)}>Détails des tours</button>
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
                    </div>
                </div>
            }

        </div>
    );
};

export default RunnerDetails;
