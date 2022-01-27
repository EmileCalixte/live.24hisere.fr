import {useParams} from "react-router-dom";
import RunnerSelector from "./RunnerSelector";

const RunnerDetails = () => {
    const {runnerId} = useParams();

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
