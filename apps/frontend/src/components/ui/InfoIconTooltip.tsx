import type React from "react";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "./Tooltip";

interface InfoIconTooltipProps {
  tooltipText: string;
}

export default function InfoIconTooltip({ tooltipText }: InfoIconTooltipProps): React.ReactElement {
  return (
    <Tooltip title={tooltipText}>
      <FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.6 }} />
    </Tooltip>
  );
}
