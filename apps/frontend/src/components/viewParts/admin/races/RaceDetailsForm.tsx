import type React from "react";
import { useMemo } from "react";
import type { SelectOption } from "../../../../types/Forms";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { getDateStringFromDate, getTimeStringFromDate } from "../../../../utils/utils";
import { Button } from "../../../ui/forms/Button";
import { Checkbox } from "../../../ui/forms/Checkbox";
import DurationInputs from "../../../ui/forms/DurationInputs";
import { Input } from "../../../ui/forms/Input";
import Select from "../../../ui/forms/Select";
import InfoIconTooltip from "../../../ui/InfoIconTooltip";

interface RaceDetailsFormProps {
  onSubmit: FormSubmitEventHandler;
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
  isImmediateStop: boolean;
  setIsImmediateStop: (isImmediateStop: boolean) => void;
  isBasicRanking: boolean;
  setIsBasicRanking: (isBasicRanking: boolean) => void;
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
  isImmediateStop,
  setIsImmediateStop,
  isBasicRanking,
  setIsBasicRanking,
  submitButtonDisabled,
}: RaceDetailsFormProps): React.ReactElement {
  const startTimeDate = useMemo(
    () =>
      // Date input value requires YYYY-MM-DD format
      getDateStringFromDate(startTime, "-").split("-").reverse().join("-"),
    [startTime],
  );

  const startTimeTime = useMemo(() => getTimeStringFromDate(startTime), [startTime]);

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
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Select
        label="Édition"
        options={editionOptions}
        value={editionId}
        onChange={onEditionSelect}
        placeholderLabel="Sélectionnez une édition"
      />

      <Input
        label="Nom"
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

      <fieldset>
        <legend>Date et heure de départ</legend>

        <div className="flex flex-col gap-1">
          <Input
            label="Date de départ"
            labelTextClassName="sr-only"
            type="date"
            required
            value={startTimeDate}
            name="start-date"
            onChange={onStartTimeDateChange}
          />

          <Input
            label="Heure de départ"
            labelTextClassName="sr-only"
            type="time"
            step={1}
            required
            value={startTimeTime}
            name="start-time"
            onChange={onStartTimeTimeChange}
          />
        </div>
      </fieldset>

      <DurationInputs legend="Durée" duration={duration} setDuration={setDuration} />

      <Checkbox
        label="Visible publiquement"
        checked={isPublic}
        onChange={(e) => {
          setIsPublic(e.target.checked);
        }}
      />

      <Checkbox
        label={
          <span className="inline-flex gap-2">
            Arrêt immédiat
            <InfoIconTooltip tooltipText="Si oui, les coureurs s'arrêtent immédiatement à la fin de la course. Si non, ils terminent leur tour en cours à la fin de la course." />
          </span>
        }
        checked={isImmediateStop}
        onChange={(e) => {
          setIsImmediateStop(e.target.checked);
        }}
      />

      <Checkbox
        label="Classement simplifié"
        checked={isBasicRanking}
        onChange={(e) => {
          setIsBasicRanking(e.target.checked);
        }}
      />

      <div>
        <Button type="submit" disabled={submitButtonDisabled}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
