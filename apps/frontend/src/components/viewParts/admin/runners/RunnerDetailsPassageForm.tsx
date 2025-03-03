import type React from "react";
import { useEffect, useRef } from "react";
import { Col, Row } from "react-bootstrap";
import { formatDateAsString } from "../../../../utils/utils";
import DurationInputs from "../../../ui/forms/DurationInputs";
import Modal from "../../../ui/Modal";

interface RunnerDetailsPassageFormProps {
  raceTime: number;
  setRaceTime: (raceTime: number) => void;
  time: Date | null;
  modalTitle: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitButtonDisabled: boolean;
  onClose: () => void;
}

export default function RunnerDetailsPassageForm({
  raceTime,
  setRaceTime,
  time,
  modalTitle,
  onSubmit,
  submitButtonDisabled,
  onClose,
}: RunnerDetailsPassageFormProps): React.ReactElement {
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
          <form
            onSubmit={(e) => {
              void onSubmit(e);
            }}
          >
            <DurationInputs legend="Temps de course" duration={raceTime} setDuration={setRaceTime} />

            {time && <p>Date et heure : {formatDateAsString(time)}</p>}

            <div className="flex justify-between">
              <button
                className="button grey"
                type="button"
                onClick={() => {
                  onClose();
                }}
              >
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
