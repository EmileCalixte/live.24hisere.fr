import React, {type FunctionComponent, useCallback, useMemo, useState} from "react";
import {type AdminRaceWithRunnerCount} from "../../../../types/Race";
import ToastUtil from "../../../../util/ToastUtil";
import RunnerDetailsPassageForm from "./RunnerDetailsPassageForm";

interface RunnerDetailsCreatePassageProps {
    runnerRace: AdminRaceWithRunnerCount | null;
    savePassage: (time: Date) => any;
    onClose: () => any;
}

const RunnerDetailsCreatePassage: FunctionComponent<RunnerDetailsCreatePassageProps> = ({
    runnerRace,
    savePassage,
    onClose,
}) => {
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

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passageTime) {
            ToastUtil.getToastr().error("Erreur : date et heure de départ de la course inconnues, impossible de calculer la date et l'heure du passage");
            return;
        }

        setIsSaving(true);

        await savePassage(passageTime);

        setIsSaving(false);

        onClose();
    }, [savePassage, passageTime, onClose]);

    return (
        <RunnerDetailsPassageForm raceTime={passageRaceTime}
                                  setRaceTime={setPassageRaceTime}
                                  time={passageTime}
                                  modalTitle="Ajouter un passage"
                                  onSubmit={onSubmit}
                                  submitButtonDisabled={isSaving}
                                  onClose={onClose}
        />
    );
};

export default RunnerDetailsCreatePassage;
