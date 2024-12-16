import React from "react";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";

interface ParticipantDetailsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  bibNumber: number;
  setBibNumber: (bibNumber: number) => void;
  isStopped: boolean;
  setIsStopped: (stopped: boolean) => void;
  submitButtonDisabled: boolean;
}

export default function ParticipantDetailsForm({
  onSubmit,
  bibNumber,
  setBibNumber,
  isStopped,
  setIsStopped,
  submitButtonDisabled,
}: ParticipantDetailsFormProps): React.ReactElement {
  return (
    <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
      <Input
        label="Numéro de dossard"
        type="number"
        name="bibNumber"
        min={1}
        required
        value={bibNumber}
        onChange={(e) => {
          setBibNumber(parseInt(e.target.value));
        }}
      />

      <Checkbox
        label="Arrêté"
        checked={isStopped}
        onChange={(e) => {
          setIsStopped(e.target.checked);
        }}
      />

      <div>
        <button className="button" type="submit" disabled={submitButtonDisabled}>
          Enregistrer
        </button>
      </div>
    </form>
  );
}
