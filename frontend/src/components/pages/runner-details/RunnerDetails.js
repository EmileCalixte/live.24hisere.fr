import {useParams} from "react-router-dom";
import RunnerSelector from "./RunnerSelector";
import {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../util/ApiUtil";

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

    const [selectedRunnerId, setSelectedRunnerId] = useState(urlRunnerId);
    const [selectedRunner, setSelectedRunner] = useState(null);

    const [runners, setRunners] = useState(false);

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
            return;
        }

        const responseJson = await response.json();
        const runner = responseJson.runner;

        setSelectedRunner(runner);
    }, [selectedRunnerId]);

    const onSelectRunner = useCallback((e) => {
        setSelectedRunnerId(e.target.value);
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

            <div className="row">
                <div className="col-12">
                    {selectedRunnerId === undefined &&
                    <div>Select a runner</div>
                    }

                    {selectedRunnerId !== undefined &&
                    <div>Runner details {selectedRunnerId}</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RunnerDetails;
