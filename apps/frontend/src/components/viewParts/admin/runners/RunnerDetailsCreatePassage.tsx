import React from "react";
import type { AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import ToastService from "../../../../services/ToastService";
import RunnerDetailsPassageFormDialog from "./RunnerDetailsPassageFormDialog";

interface RunnerDetailsCreatePassageProps {
  runnerRace: AdminRaceWithRunnerCount | null;
  savePassage: (time: Date, comment: string | null) => unknown;
  onClose: () => void;
}

export default function RunnerDetailsCreatePassageDialog({
  runnerRace,
  savePassage,
  onClose,
}: RunnerDetailsCreatePassageProps): React.ReactElement {
  const [passageRaceTime, setPassageRaceTime] = React.useState(0);
  const [passageComment, setPassageComment] = React.useState<string | null>(null);

  const [isSaving, setIsSaving] = React.useState(false);

  const passageTime = React.useMemo<Date | null>(() => {
    if (!runnerRace) {
      return null;
    }

    const raceStartTime = new Date(runnerRace.startTime);

    if (isNaN(raceStartTime.getTime())) {
      return null;
    }

    return new Date(raceStartTime.getTime() + passageRaceTime);
  }, [runnerRace, passageRaceTime]);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!passageTime) {
        ToastService.getToastr().error(
          "Erreur : date et heure de départ de la course inconnues, impossible de calculer la date et l'heure du passage",
        );
        return;
      }

      setIsSaving(true);

      await savePassage(passageTime, passageComment);

      setIsSaving(false);

      onClose();
    },
    [passageTime, savePassage, passageComment, onClose],
  );

  return (
    <RunnerDetailsPassageFormDialog
      raceTime={passageRaceTime}
      setRaceTime={setPassageRaceTime}
      time={passageTime}
      comment={passageComment ?? ""}
      setComment={setPassageComment}
      title="Ajouter un passage"
      onSubmit={onSubmit}
      submitButtonDisabled={isSaving}
      onClose={onClose}
    />
  );
}
