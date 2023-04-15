import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef} from "react";
import {Col, Row} from "react-bootstrap";
import {formatDateAsString} from "../../../../util/utils";
import DurationInputs from "../../../forms/DurationInputs";

interface RunnerDetailsPassageFormProps {
    raceTime: number;
    setRaceTime: (raceTime: number) => any;
    time: Date | null;
    modalTitle: string;
    onSubmit: (e: React.FormEvent) => any;
    submitButtonDisabled: boolean;
    onClose: () => any;
}

export default function RunnerDetailsPassageForm({
    raceTime,
    setRaceTime,
    time,
    modalTitle,
    onSubmit,
    submitButtonDisabled,
    onClose,
}: RunnerDetailsPassageFormProps) {
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
                <FontAwesomeIcon icon={faXmark} />
            </button>

            <Row>
                <Col>
                    <h3 className="mt-0">{modalTitle}</h3>
                </Col>
            </Row>

            <Row>
                <Col>
                    <form onSubmit={onSubmit}>
                        <div>
                            <legend>Temps de course</legend>
                            <div className="inline-input-group">
                                <DurationInputs duration={raceTime} setDuration={setRaceTime}/>
                            </div>
                        </div>

                        {time &&
                            <div className="mt-3">
                                Date et heure : {formatDateAsString(time)}
                            </div>
                        }

                        <div className="flex-space-between-container">
                            <button className="button grey" type="button" onClick={() => onClose()}>
                                Annuler
                            </button>

                            <button className="button" type="submit" disabled={submitButtonDisabled}>
                                Enregistrer
                            </button>
                        </div>
                    </form>
                </Col>
            </Row>
        </dialog>
    );
}
