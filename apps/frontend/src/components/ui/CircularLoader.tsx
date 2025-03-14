import type React from "react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CircularLoaderProps {
  asideText?: string;
}

export default function CircularLoader({ asideText }: CircularLoaderProps): React.ReactElement {
  return (
    <span>
      <span>
        <FontAwesomeIcon icon={faCircleNotch} className="animate-[spin_500ms_linear_infinite]" />
      </span>

      {asideText && <span className="ml-2">{asideText}</span>}
    </span>
  );
}
