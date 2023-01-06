import React, {useCallback, useMemo, useState} from "react";
import {AdminProcessedPassage} from "../../../../types/Passage";
import {RaceWithRunnerCount} from "../../../../types/Race";
import ToastUtil from "../../../../util/ToastUtil";
import RunnerDetailsPassageForm from "./RunnerDetailsPassageForm";

const RunnerDetailsEditPassage: React.FunctionComponent<{
    passage: AdminProcessedPassage,
    runnerRace: RaceWithRunnerCount | null,
    updatePassage: (passage: AdminProcessedPassage, time: Date) => any,
    onClose: () => any,
}> = ({passage, runnerRace, updatePassage, onClose}) => {
    const [passageRaceDuration, setPassageRaceDuration] = useState(passage.processed.lapEndRaceTime);

    const passageTime = useMemo<Date | null>(() => {
        if (!runnerRace) {
            return null;
        }

        const raceStartTime = new Date(runnerRace.startTime);

        if (isNaN(raceStartTime.getTime())) {
            return null;
        }

        return new Date(raceStartTime.getTime() + passageRaceDuration);
    }, [runnerRace, passageRaceDuration]);

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passageTime) {
            ToastUtil.getToastr().error("Erreur : date et heure de départ de la course inconnues, impossible de calculer la date et l'heure du passage");
            return;
        }

        await updatePassage(passage, passageTime);

        onClose();
    }, [updatePassage, passage, passageTime]);

    return (
        <RunnerDetailsPassageForm raceDuration={passageRaceDuration}
                                  setRaceDuration={setPassageRaceDuration}
                                  time={passageTime}
                                  modalTitle={`Modification passage #${passage.id}`}
                                  onSubmit={onSubmit}
                                  onClose={onClose}
        />
    );
}

export default RunnerDetailsEditPassage;
