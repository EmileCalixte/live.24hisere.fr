import React from "react";
import { TrackedEvent } from "../../../../constants/eventTracking/customEventNames";
import { runnerDetailsViewContext } from "../../../../contexts/RunnerDetailsViewContext";
import { trackEvent } from "../../../../utils/eventTracking/eventTrackingUtils";
import { generateXlsxFromData } from "../../../../utils/excelUtils";
import { getDataForExcelExport } from "../../../../utils/runnerUtils";
import CircularLoader from "../../../ui/CircularLoader";
import SpeedChart from "../charts/SpeedChart";
import RunnerDetailsLaps from "../RunnerDetailsLaps";
import RunnerDetailsStats from "../RunnerDetailsStats";

export function StatsTabContent(): React.ReactElement {
  const { selectedRace, selectedRaceEdition, selectedRankingRunner, ranking } =
    React.useContext(runnerDetailsViewContext);

  const exportRunnerToXlsx = React.useCallback(() => {
    if (!selectedRace || !selectedRaceEdition || !selectedRankingRunner) {
      return;
    }

    trackEvent(TrackedEvent.DOWNLOAD_RUNNER_LAPS_XLSX, {
      runnerId: selectedRankingRunner.id,
      raceId: selectedRace.id,
    });

    const filename =
      `${selectedRankingRunner.firstname} ${selectedRankingRunner.lastname} - ${selectedRace.name} - ${selectedRaceEdition.name}`.trim();

    generateXlsxFromData(getDataForExcelExport(selectedRankingRunner), filename);
  }, [selectedRace, selectedRaceEdition, selectedRankingRunner]);

  return (
    <>
      {selectedRankingRunner && selectedRace && ranking ? (
        <div className="gap-default flex flex-col">
          <RunnerDetailsStats runner={selectedRankingRunner} race={selectedRace} ranking={ranking} />

          {selectedRankingRunner.totalAverageSpeed !== null && !selectedRace.isBasicRanking && (
            <SpeedChart
              runner={selectedRankingRunner}
              race={selectedRace}
              averageSpeed={selectedRankingRunner.totalAverageSpeed}
            />
          )}

          {!selectedRace.isBasicRanking && selectedRankingRunner.passages.length > 0 && (
            <RunnerDetailsLaps
              runner={selectedRankingRunner}
              race={selectedRace}
              exportRunnerToXlsx={exportRunnerToXlsx}
            />
          )}
        </div>
      ) : (
        <p>
          <CircularLoader asideText="Chargement des données" />
        </p>
      )}
    </>
  );
}
