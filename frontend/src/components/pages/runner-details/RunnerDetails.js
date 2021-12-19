import {useParams} from "react-router-dom";

const RunnerDetails = () => {
    const {runnerId} = useParams();

    return(
        <div>Runner details {runnerId}</div>
    )
}

export default RunnerDetails;
