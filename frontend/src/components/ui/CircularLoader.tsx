import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CircularLoader(): JSX.Element {
    return (
        <span className="circular-loader">
            <FontAwesomeIcon icon={faCircleNotch} />
        </span>
    );
}
