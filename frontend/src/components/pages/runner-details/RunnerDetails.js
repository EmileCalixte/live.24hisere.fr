import {useParams} from "react-router-dom";
import RunnerSelector from "./RunnerSelector";
import {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../util/ApiUtil";

const RunnerDetails = () => {
    const {runnerId} = useParams();

    const [runners, setRunners] = useState(false);

    const fetchRunners = useCallback(async () => {
        const response = await ApiUtil.performAPIRequest('/runners');
        const responseJson = await response.json();

        setRunners(responseJson.runners);
    }, []);

    useEffect(() => {
        fetchRunners();
    }, [fetchRunners]);

    return(
        <div id="page-runner-details">
            <div className="row hide-on-print">
                <div className="col-12">
                    <h1>Détails coureur</h1>
                </div>
            </div>

            <div className="row hide-on-print">
                <div className="col-12">
                    <RunnerSelector />
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    {runnerId === undefined &&
                    <div>Select a runner</div>
                    }

                    {runnerId !== undefined &&
                    <div>Runner details {runnerId}</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RunnerDetails;
