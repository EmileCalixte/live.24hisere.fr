import {useParams} from "react-router-dom";
import RunnerSelector from "./RunnerSelector";

const RunnerDetails = () => {
    const {runnerId} = useParams();

    return(
        <>
            <RunnerSelector />

            {runnerId === undefined &&
            <div>Select a runner</div>
            }

            {runnerId !== undefined &&
            <div>Runner details {runnerId}</div>
            }
        </>
    )
}

export default RunnerDetails;
