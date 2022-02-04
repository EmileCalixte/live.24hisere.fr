import {useParams} from "react-router-dom";
import RunnerSelector from "./RunnerSelector";
import {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../util/ApiUtil";

const TAB_STATS = 'stats';
const TAB_LAPS = 'laps';

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

    const [selectedRunnerId, setSelectedRunnerId] = useState(urlRunnerId);
    const [selectedRunner, setSelectedRunner] = useState(null);

    const [runners, setRunners] = useState(false);

    const [selectedTab, setSelectedTab] = useState(TAB_STATS);

    const fetchRunners = useCallback(async () => {
        const response = await ApiUtil.performAPIRequest('/runners');
        const responseJson = await response.json();

        setRunners(responseJson.runners);
    }, []);

    const fetchSelectedRunner = useCallback(async () => {
        if (!selectedRunnerId) {
            return;
        }

        const response = await ApiUtil.performAPIRequest(`/runners/${selectedRunnerId}`);

        if (!response.ok) {
            console.error('Failed to fetch runner', await response.json());
            setSelectedRunner(null);
            return;
        }

        const responseJson = await response.json();
        const runner = responseJson.runner;

        setSelectedRunner(runner);
    }, [selectedRunnerId]);

    const onSelectRunner = useCallback((e) => {
        setSelectedRunnerId(e.target.value);
    }, []);

    const onTabButtonClick = useCallback((e) => {
        setSelectedTab(e.target.value);
    }, []);

    useEffect(() => {
        fetchRunners();
    }, [fetchRunners]);

    useEffect(() => {
        fetchSelectedRunner();
    }, [selectedRunnerId]);

    useEffect(() => {
        if (selectedRunnerId === urlRunnerId) {
            return;
        }

        // TODO better UX: use pushState instead of replaceState & handle popState event
        history.replaceState(history.state, '', `/runner-details/${selectedRunnerId}`);
    }, [selectedRunnerId]);

    console.log(selectedRunner);

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
                <div className="col-12">
                    <div className="runner-details-data-container">
                        <ul className="tabs-container">
                            <li className={selectedTab === TAB_STATS ? 'active' : ''}>
                                <button value={TAB_STATS} onClick={onTabButtonClick}>Statistiques</button>
                            </li>
                            <li className={selectedTab === TAB_LAPS ? 'active' : ''}>
                                <button value={TAB_LAPS} onClick={onTabButtonClick}>Détails des tours</button>
                            </li>
                        </ul>

                        <div className="runner-details-data">
                            Runner details {selectedRunnerId}
                        </div>
                    </div>
                </div>
            </div>
            }

        </div>
    )
}

export default RunnerDetails;
