import type React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../Tooltip";

type RunnerStoppedTooltipProps = Pick<React.ComponentProps<typeof TooltipTrigger>, "children">;

export default function RunnerStoppedTooltip({ children }: RunnerStoppedTooltipProps): React.ReactElement {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        Ce coureur a annoncé s'être arrêté. Il sera quand même classé à la fin de la course.
      </TooltipContent>
    </Tooltip>
  );
}
