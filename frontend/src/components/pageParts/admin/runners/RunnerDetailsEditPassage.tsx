import React, {useCallback, useMemo, useState} from "react";
import ToastUtil from "../../../../util/ToastUtil";
import RunnerDetailsPassageForm from "./RunnerDetailsPassageForm";

interface RunnerDetailsEditPassageProps {
    passage: AdminProcessedPassage;
    runnerRace: AdminRaceWithRunnerCount | null;
    updatePassage: (passage: AdminProcessedPassage, time: Date) => any;
    onClose: () => any;
}

export default function RunnerDetailsEditPassage({
    passage,
    runnerRace,
    updatePassage,
    onClose,
}: RunnerDetailsEditPassageProps) {
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

    const unsavedChanges = useMemo(() => {
        return [
            passage.processed.lapEndRaceTime === passageRaceTime,
        ].includes(false);
    }, [passage, passageRaceTime]);

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passageTime) {
            ToastUtil.getToastr().error("Erreur : date et heure de départ de la course inconnues, impossible de calculer la date et l'heure du passage");
            return;
        }

        setIsSaving(true);

        await updatePassage(passage, passageTime);

        setIsSaving(false);

        onClose();
    }, [updatePassage, passage, passageTime, onClose]);

    return (
        <RunnerDetailsPassageForm raceTime={passageRaceTime}
                                  setRaceTime={setPassageRaceTime}
                                  time={passageTime}
                                  modalTitle={`Modification passage #${passage.id}`}
                                  onSubmit={onSubmit}
                                  submitButtonDisabled={isSaving || !unsavedChanges}
                                  onClose={onClose}
        />
    );
}
