import React from "react";
import type { AdminProcessedPassage, AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { stringUtils } from "@live24hisere/utils";
import ToastService from "../../../../services/ToastService";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import RunnerDetailsPassageFormDialog from "./RunnerDetailsPassageFormDialog";

interface RunnerDetailsEditPassageProps {
  passage: AdminProcessedPassage;
  runnerRace: AdminRaceWithRunnerCount | null;
  updatePassage: (passage: AdminProcessedPassage, time: Date, comment: string | null) => unknown;
  onClose: () => void;
}

export default function RunnerDetailsEditPassageDialog({
  passage,
  runnerRace,
  updatePassage,
  onClose,
}: RunnerDetailsEditPassageProps): React.ReactElement {
  const [passageRaceTime, setPassageRaceTime] = React.useState(passage.processed.lapEndRaceTime);
  const [passageComment, setPassageComment] = React.useState(passage.comment);

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

  const unsavedChanges = React.useMemo(
    () =>
      [
        passage.processed.lapEndRaceTime === passageRaceTime,
        stringUtils.nonEmptyOrNull(passage.comment) === stringUtils.nonEmptyOrNull(passageComment),
      ].includes(false),
    [passage.comment, passage.processed.lapEndRaceTime, passageComment, passageRaceTime],
  );

  const onSubmit = React.useCallback<FormSubmitEventHandler>(
    (e) => {
      void (async () => {
        e.preventDefault();

        if (!passageTime) {
          ToastService.getToastr().error(
            "Erreur : date et heure de départ de la course inconnues, impossible de calculer la date et l'heure du passage",
          );
          return;
        }

        setIsSaving(true);

        await updatePassage(passage, passageTime, passageComment);

        setIsSaving(false);

        onClose();
      })();
    },
    [passageTime, updatePassage, passage, passageComment, onClose],
  );

  return (
    <RunnerDetailsPassageFormDialog
      raceTime={passageRaceTime}
      setRaceTime={setPassageRaceTime}
      time={passageTime}
      comment={passageComment ?? ""}
      setComment={setPassageComment}
      title={`Modification du passage #${passage.id}`}
      onSubmit={onSubmit}
      submitButtonDisabled={isSaving || !unsavedChanges}
      onClose={onClose}
    />
  );
}
