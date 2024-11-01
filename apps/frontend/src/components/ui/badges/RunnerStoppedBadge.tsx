import React from "react";
import RunnerStoppedTooltip from "../tooltips/RunnerStoppedTooltip";

export default function RunnerStoppedBadge(): React.ReactElement {
  return <RunnerStoppedTooltip className="ranking-table-runner-stopped-badge">Arrêté</RunnerStoppedTooltip>;
}
