import React, { useCallback, useMemo, useState } from "react";
import ToastService from "../../../../services/ToastService";
import { type AdminProcessedPassage } from "../../../../types/Passage";
import { type AdminRaceWithRunnerCount } from "../../../../types/Race";
import RunnerDetailsPassageForm from "./RunnerDetailsPassageForm";

interface RunnerDetailsEditPassageProps {
    passage: AdminProcessedPassage;
    runnerRace: AdminRaceWithRunnerCount | null;
    updatePassage: (
        passage: AdminProcessedPassage,
        time: Date,
    ) => Promise<void>;
    onClose: () => void;
}

export default function RunnerDetailsEditPassage({
    passage,
    runnerRace,
    updatePassage,
    onClose,
}: RunnerDetailsEditPassageProps): React.ReactElement {
    const [passageRaceTime, setPassageRaceTime] = useState(
        passage.processed.lapEndRaceTime,
    );

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
        return [passage.processed.lapEndRaceTime === passageRaceTime].includes(
            false,
        );
    }, [passage, passageRaceTime]);

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
        <RunnerDetailsPassageForm
            raceTime={passageRaceTime}
            setRaceTime={setPassageRaceTime}
            time={passageTime}
            modalTitle={`Modification passage #${passage.id}`}
            onSubmit={onSubmit}
            submitButtonDisabled={isSaving || !unsavedChanges}
            onClose={onClose}
        />
    );
}
