import React, {useEffect, useRef} from "react";
import {Col, Row} from "react-bootstrap";
import {formatDateAsString} from "../../../../util/utils";
import DurationInputs from "../../../ui/forms/DurationInputs";
import Modal from "../../../ui/Modal";

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
        <Modal close={onClose} className="runner-passage-time-modal">
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
                            <p>
                                Date et heure : {formatDateAsString(time)}
                            </p>
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
        </Modal>
    );
}
