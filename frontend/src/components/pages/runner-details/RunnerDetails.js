import {useParams} from "react-router-dom";
import RunnerSelector from "./RunnerSelector";
import {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../util/ApiUtil";

const RunnerDetails = () => {
    const {runnerId: urlRunnerId} = useParams();

    const [selectedRunnerId, setSelectedRunnerId] = useState(urlRunnerId);

    const [runners, setRunners] = useState(false);

    const fetchRunners = useCallback(async () => {
        const response = await ApiUtil.performAPIRequest('/runners');
        const responseJson = await response.json();

        setRunners(responseJson.runners);
    }, []);

    const onSelectRunner = useCallback((e) => {
        setSelectedRunnerId(e.target.value);
    }, []);

    useEffect(() => {
        fetchRunners();
    }, [fetchRunners]);

    useEffect(() => {
        console.log(selectedRunnerId, urlRunnerId);
        if (selectedRunnerId === urlRunnerId) {
            return;
        }

        // TODO better UX: use pushState instead of replaceState & handle popState event
        history.replaceState(history.state, '', `/runner-details/${selectedRunnerId}`);
    }, [selectedRunnerId]);

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
