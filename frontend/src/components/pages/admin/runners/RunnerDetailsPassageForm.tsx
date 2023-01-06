import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AdminProcessedPassage} from "../../../../types/Passage";
import {RaceWithRunnerCount} from "../../../../types/Race";
import ToastUtil from "../../../../util/ToastUtil";
import Util from "../../../../util/Util";
import DurationInputs from "../../../misc/DurationInputs";

const RunnerDetailsPassageForm: React.FunctionComponent<{
    runnerRace: RaceWithRunnerCount | null,
    passage: AdminProcessedPassage,
    updatePassage: (passage: AdminProcessedPassage, time: Date) => any,
    onClose: () => any,
}> = ({runnerRace, passage, updatePassage, onClose}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

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

    const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!passageTime) {
            ToastUtil.getToastr().error("Erreur : date et heure de départ de la course inconnues, impossible de calculer la date et l'heure du passage");
            return;
        }

        await updatePassage(passage, passageTime);
        onClose();
    }, [updatePassage, passage, passageTime, onClose]);

    useEffect(() => {
        if (dialogRef.current?.open) {
            return;
        }

        dialogRef.current?.showModal();
    }, [dialogRef]);

    return (
        <dialog ref={dialogRef} className="modal runner-passage-time-modal">
            <button className="close-button" onClick={() => onClose()}>
                <i className="fa-solid fa-xmark"/>
            </button>

            <div className="row">
                <div className="col-12">
                    <h3 className="mt-0">Modification passage #{passage.id}</h3>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <form onSubmit={onSubmit}>
                        <div>
                            <legend>Temps de course</legend>
                            <div className="inline-input-group">
                                <DurationInputs duration={passageRaceDuration} setDuration={setPassageRaceDuration}/>
                            </div>
                        </div>

                        {passageTime &&
                        <div className="mt-3">
                            Date et heure : {Util.formatDateAsString(passageTime)}
                        </div>
                        }

                        <div className="modal-bottom-buttons-container mt-3">
                            <button className="button grey" onClick={() => onClose()}>Annuler</button>
                            <button className="button">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export default RunnerDetailsPassageForm;
