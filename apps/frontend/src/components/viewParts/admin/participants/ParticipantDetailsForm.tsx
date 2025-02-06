import type React from "react";
import type { SelectOption } from "../../../../types/Forms";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";
import Select from "../../../ui/forms/Select";

interface ParticipantDetailsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  runnerOptions?: SelectOption[] | false;
  runnerId?: number | undefined;
  onRunnerChange?: React.ChangeEventHandler<HTMLSelectElement>;
  bibNumber: number | undefined;
  setBibNumber: (bibNumber: number) => void;
  isBibNumberAvailable: boolean;
  isStopped: boolean;
  setIsStopped: (stopped: boolean) => void;
  distanceAfterLastPassage: number | string;
  setDistanceAfterLastPassage: (distance: number | string) => void;
  submitButtonDisabled: boolean;
}

export default function ParticipantDetailsForm({
  onSubmit,
  runnerOptions,
  runnerId,
  onRunnerChange,
  bibNumber,
  setBibNumber,
  isBibNumberAvailable,
  isStopped,
  setIsStopped,
  distanceAfterLastPassage,
  setDistanceAfterLastPassage,
  submitButtonDisabled,
}: ParticipantDetailsFormProps): React.ReactElement {
  return (
    <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
      {onRunnerChange && (
        <Select
          label="Coureur"
          options={Array.isArray(runnerOptions) ? runnerOptions : []}
          value={runnerId}
          onChange={onRunnerChange}
          placeholderLabel="Choisissez un coureur"
          loadingOptionLabel="Chargement des coureurs..."
          isLoading={runnerOptions === false}
        />
      )}

      <Input
        label="Numéro de dossard"
        type="number"
        name="bibNumber"
        min={1}
        required
        value={bibNumber}
        hasError={!isBibNumberAvailable}
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

      <Input
        label="Distance après dernier passage (m)"
        type="number"
        min={0}
        step={0.001}
        required
        name="initial-distance"
        value={distanceAfterLastPassage}
        onChange={(e) => {
          setDistanceAfterLastPassage(e.target.value);
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
