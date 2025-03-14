import type React from "react";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

interface InfoIconTooltipProps {
  tooltipText: string;
}

export default function InfoIconTooltip({ tooltipText }: InfoIconTooltipProps): React.ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger>
        <FontAwesomeIcon icon={faCircleInfo} style={{ opacity: 0.6 }} />
      </TooltipTrigger>

      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
