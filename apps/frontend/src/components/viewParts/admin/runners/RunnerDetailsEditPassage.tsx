import type React from "react";
import { useCallback, useMemo, useState } from "react";
import type { AdminProcessedPassage, AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import ToastService from "../../../../services/ToastService";
import RunnerDetailsPassageFormDialog from "./RunnerDetailsPassageFormDialog";

interface RunnerDetailsEditPassageProps {
  passage: AdminProcessedPassage;
  runnerRace: AdminRaceWithRunnerCount | null;
  updatePassage: (passage: AdminProcessedPassage, time: Date) => unknown;
  onClose: () => void;
}

export default function RunnerDetailsEditPassageDialog({
  passage,
  runnerRace,
  updatePassage,
  onClose,
}: RunnerDetailsEditPassageProps): React.ReactElement {
  const [passageRaceTime, setPassageRaceTime] = useState(passage.processed.lapEndRaceTime);

  const [isSaving, setIsSaving] = useState(false);

  const passageTime = useMemo<Date | null>(() => {
    if (!runnerRace) {
      return null;
    }

    const raceStartTime = new Date(runnerRace.startTime);

    if (isNaN(raceStartTime.getTime())) {
      return null;
    }

    return new Date(raceStartTime.getTime() + passageRaceTime);
  }, [runnerRace, passageRaceTime]);

  const unsavedChanges = useMemo(
    () => [passage.processed.lapEndRaceTime === passageRaceTime].includes(false),
    [passage, passageRaceTime],
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!passageTime) {
        ToastService.getToastr().error(
          "Erreur : date et heure de départ de la course inconnues, impossible de calculer la date et l'heure du passage",
        );
        return;
      }

      setIsSaving(true);

      await updatePassage(passage, passageTime);

      setIsSaving(false);

      onClose();
    },
    [updatePassage, passage, passageTime, onClose],
  );

  return (
    <RunnerDetailsPassageFormDialog
      raceTime={passageRaceTime}
      setRaceTime={setPassageRaceTime}
      time={passageTime}
      title={`Modification du passage #${passage.id}`}
      onSubmit={onSubmit}
      submitButtonDisabled={isSaving || !unsavedChanges}
      onClose={onClose}
    />
  );
}
