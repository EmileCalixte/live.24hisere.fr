import React, {useEffect, useRef} from "react";
import Util from "../../../../util/Util";
import DurationInputs from "../../../misc/DurationInputs";

const RunnerDetailsPassageForm: React.FunctionComponent<{
    raceDuration: number,
    setRaceDuration: (raceDuration: number) => any,
    time: Date | null,
    modalTitle: string,
    onSubmit: (e: React.FormEvent) => any,
    submitButtonDisabled: boolean,
    onClose: () => any,
}> = ({raceDuration, setRaceDuration, time, modalTitle, onSubmit, submitButtonDisabled, onClose}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);

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
                    <h3 className="mt-0">{modalTitle}</h3>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <form onSubmit={onSubmit}>
                        <div>
                            <legend>Temps de course</legend>
                            <div className="inline-input-group">
                                <DurationInputs duration={raceDuration} setDuration={setRaceDuration}/>
                            </div>
                        </div>

                        {time &&
                        <div className="mt-3">
                            Date et heure : {Util.formatDateAsString(time)}
                        </div>
                        }

                        <div className="modal-bottom-buttons-container mt-3">
                            <button className="button grey" type="button" onClick={() => onClose()}>
                                Annuler
                            </button>

                            <button className="button" type="submit" disabled={submitButtonDisabled}>
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export default RunnerDetailsPassageForm;
