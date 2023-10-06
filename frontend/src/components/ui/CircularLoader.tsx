import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function CircularLoader(): React.ReactElement {
    return (
        <span className="circular-loader">
            <FontAwesomeIcon icon={faCircleNotch} />
        </span>
    );
}
