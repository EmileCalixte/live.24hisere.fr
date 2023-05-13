import {faCircleNotch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function CircularLoader() {
    return (
        <span className="circular-loader">
            <FontAwesomeIcon icon={faCircleNotch} />
        </span>
    );
}
