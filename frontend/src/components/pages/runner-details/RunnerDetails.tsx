import {useParams} from "react-router-dom";
import RunnerSelector from "./RunnerSelector";
import React, {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../util/ApiUtil";
import RunnerDetailsStats from "./RunnerDetailsStats";
import RunnerDetailsLaps from "./RunnerDetailsLaps";
import RunnerDetailsUtil from "../../../util/RunnerDetailsUtil";
import ExcelUtil from "../../../util/ExcelUtil";
import {app} from "../../App";
import Runner, {RunnerWithPassages} from "../../../types/Runner";

enum Tab {
    Stats = 'stats',
    Laps = 'laps',
}

export const RUNNER_UPDATE_INTERVAL_TIME = 30000;

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

    const [selectedRunnerId, setSelectedRunnerId] = useState(urlRunnerId);
    const [selectedRunner, setSelectedRunner] = useState<RunnerWithPassages | null>(null);

    const [runners, setRunners] = useState<Runner[] | false>(false);

    const [selectedTab, setSelectedTab] = useState(Tab.Stats);

    const fetchRunners = useCallback(async () => {
        const response = await ApiUtil.performAPIRequest('/runners');
        const responseJson = await response.json();

        setRunners(responseJson.runners);
    }, []);

    const fetchSelectedRunner = useCallback(async () => {
        if (!selectedRunnerId) {
            return;
        }

        app.setState({
            isFetching: true,
        });

        const response = await ApiUtil.performAPIRequest(`/runners/${selectedRunnerId}`);

        app.setState({
            isFetching: false,
        });

        if (!response.ok) {
            console.error('Failed to fetch runner', await response.json());
            setSelectedRunner(null);
            return;
        }

        const responseJson = await response.json();
        const runner = responseJson.runner as RunnerWithPassages;

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

        RunnerDetailsUtil.processRunnerData(runner);

        setSelectedRunner(runner);
    }, [selectedRunnerId]);

    const onSelectRunner = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRunnerId(e.target.value);
    }, []);

    const exportRunnerToXlsx = useCallback(() => {
        if (selectedRunner === null) {
            return;
        }

        const filename = `${selectedRunner.firstname} ${selectedRunner.lastname}`.trim();

        ExcelUtil.generateXlsxFromData(RunnerDetailsUtil.getDataForExcelExport(selectedRunner), filename);
    }, [selectedRunner]);

    useEffect(() => {
        fetchRunners();
    }, [fetchRunners]);

    useEffect(() => {
        fetchSelectedRunner();

        const refreshRunnerInterval = setInterval(fetchSelectedRunner, RUNNER_UPDATE_INTERVAL_TIME);
        return (() => clearInterval(refreshRunnerInterval));
    }, [fetchSelectedRunner]);

    useEffect(() => {
        if (selectedRunner === null) {
            return;
        }

        const runner = selectedRunner;
        RunnerDetailsUtil.processRunnerData(runner);
        setSelectedRunner(runner);
    }, [selectedRunner]);

    useEffect(() => {
        if (selectedRunnerId === urlRunnerId) {
            return;
        }

        // TODO better UX: use pushState instead of replaceState & handle popState event
        window.history.replaceState(window.history.state, '', `/runner-details/${selectedRunnerId}`);
    }, [selectedRunnerId, urlRunnerId]);

    return(
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
                            <li className={selectedTab === Tab.Stats ? 'active' : ''}>
                                <button onClick={() => setSelectedTab(Tab.Stats)}>Statistiques</button>
                            </li>
                            <li className={selectedTab === Tab.Laps ? 'active' : ''}>
                                <button onClick={() => setSelectedTab(Tab.Laps)}>Détails des tours</button>
                            </li>
                        </ul>

                        <div className="runner-details-data">
                            {(() => {
                                switch (selectedTab) {
                                    case Tab.Stats:
                                        return <RunnerDetailsStats runner={selectedRunner} />
                                    case Tab.Laps:
                                        return <RunnerDetailsLaps runner={selectedRunner} />
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
    )
}

export default RunnerDetails;
