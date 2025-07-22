import React from "react";
import { racesViewContext } from "../../../../contexts/RacesViewContext";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";

export function StatsTabContent(): React.ReactElement {
  const { selectedRace, selectedEdition } = React.useContext(racesViewContext);

  if (!selectedRace || !selectedEdition) {
    return <CircularLoader />;
  }

  return (
    <Card className="flex flex-col gap-3">
      <h2>Statistiques</h2>
    </Card>
  );
}
