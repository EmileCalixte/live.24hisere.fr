import type React from "react";
import RunnerStoppedTooltip from "../tooltips/RunnerStoppedTooltip";

export default function RunnerStoppedBadge(): React.ReactElement {
  return (
    <RunnerStoppedTooltip className="print-exact inline-block rounded-sm bg-red-600 px-1 py-0.5 text-xs font-bold text-red-50 dark:bg-red-700 dark:text-red-100">
      Arrêté
    </RunnerStoppedTooltip>
  );
}
