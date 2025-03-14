import type React from "react";
import { useCallback, useMemo, useState } from "react";
import type { AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import ToastService from "../../../../services/ToastService";
import RunnerDetailsPassageFormDialog from "./RunnerDetailsPassageFormDialog";

interface RunnerDetailsCreatePassageProps {
  runnerRace: AdminRaceWithRunnerCount | null;
  savePassage: (time: Date) => unknown;
  onClose: () => void;
}

export default function RunnerDetailsCreatePassageDialog({
  runnerRace,
  savePassage,
  onClose,
}: RunnerDetailsCreatePassageProps): React.ReactElement {
  const [passageRaceTime, setPassageRaceTime] = useState(0);

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

      await savePassage(passageTime);

      setIsSaving(false);

      onClose();
    },
    [savePassage, passageTime, onClose],
  );

  return (
    <RunnerDetailsPassageFormDialog
      raceTime={passageRaceTime}
      setRaceTime={setPassageRaceTime}
      time={passageTime}
      title="Ajouter un passage"
      onSubmit={onSubmit}
      submitButtonDisabled={isSaving}
      onClose={onClose}
    />
  );
}
