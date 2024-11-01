import React from "react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CircularLoaderProps {
  asideText?: string;
}

export default function CircularLoader({ asideText }: CircularLoaderProps): React.ReactElement {
  return (
    <span>
      <span className="circular-loader">
        <FontAwesomeIcon icon={faCircleNotch} />
      </span>

      {asideText && <span className="ms-2">{asideText}</span>}
    </span>
  );
}
