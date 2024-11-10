import React, { useMemo } from "react";
import { type SelectOption } from "../../../../types/Forms";
import { getDateStringFromDate, getTimeStringFromDate } from "../../../../utils/utils";
import { Checkbox } from "../../../ui/forms/Checkbox";
import DurationInputs from "../../../ui/forms/DurationInputs";
import { Input } from "../../../ui/forms/Input";
import Select from "../../../ui/forms/Select";

interface RaceDetailsFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  editionOptions: Array<SelectOption<number>>;
  editionId: number;
  setEditionId: (editionId: number) => void;
  name: string;
  setName: (name: string) => void;
  initialDistance: number | string;
  setInitialDistance: (initialDistance: number | string) => void;
  lapDistance: number | string;
  setLapDistance: (lapDistance: number | string) => void;
  startTime: Date;
  setStartTime: (startTime: Date) => void;
  duration: number;
  setDuration: (duration: number) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  submitButtonDisabled: boolean;
}

export default function RaceDetailsForm({
  onSubmit,
  editionOptions,
  editionId,
  setEditionId,
  name,
  setName,
  initialDistance,
  setInitialDistance,
  lapDistance,
  setLapDistance,
  startTime,
  setStartTime,
  duration,
  setDuration,
  isPublic,
  setIsPublic,
  submitButtonDisabled,
}: RaceDetailsFormProps): React.ReactElement {
  const startTimeDate = useMemo(() => {
    if (!startTime) {
      return;
    }

    // Date input value requires YYYY-MM-DD format
    return getDateStringFromDate(startTime, "-").split("-").reverse().join("-");
  }, [startTime]);

  const startTimeTime = useMemo(() => {
    if (!startTime) {
      return "";
    }

    return getTimeStringFromDate(startTime);
  }, [startTime]);

  const onEditionSelect = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setEditionId(parseInt(e.target.value));
  };

  const onStartTimeDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.value) {
      return;
    }

    setStartTime(new Date(`${e.target.value}T${startTimeTime}`));
  };

  const onStartTimeTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.value || !startTimeDate) {
      return;
    }

    setStartTime(new Date(`${startTimeDate}T${e.target.value}`));
  };

  return (
    <form
      onSubmit={(e) => {
        void onSubmit(e);
      }}
    >
      <Select
        label="Édition"
        options={editionOptions}
        value={editionId}
        onChange={onEditionSelect}
        placeholderLabel="Sélectionnez une édition"
      />

      <Input
        label="Nom"
        className="mt-3"
        maxLength={50}
        required
        name="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      <Input
        label="Distance avant premier passage (m)"
        className="mt-3"
        type="number"
        min={0}
        step={0.001}
        required
        name="initial-distance"
        value={initialDistance}
        onChange={(e) => {
          setInitialDistance(e.target.value);
        }}
      />

      <Input
        label="Distance du tour (m)"
        className="mt-3"
        type="number"
        min={0}
        step={0.001}
        required
        name="lap-distance"
        value={lapDistance}
        onChange={(e) => {
          setLapDistance(e.target.value);
        }}
      />

      <div className="input-group mt-3">
        <label>
          Date et heure de départ
          <input
            className="input"
            type="date"
            required={true}
            value={startTimeDate}
            name="start-date"
            onChange={onStartTimeDateChange}
          />
          <input
            className="input"
            type="time"
            step={1}
            required={true}
            value={startTimeTime}
            name="start-time"
            onChange={onStartTimeTimeChange}
          />
        </label>
      </div>

      <DurationInputs legend="Durée" className="mt-3" duration={duration} setDuration={setDuration} />

      <Checkbox
        label="Visible par les utilisateurs"
        checked={isPublic}
        className="mt-3"
        onChange={(e) => {
          setIsPublic(e.target.checked);
        }}
      />

      <button className="button mt-3" type="submit" disabled={submitButtonDisabled}>
        Enregistrer
      </button>
    </form>
  );
}
