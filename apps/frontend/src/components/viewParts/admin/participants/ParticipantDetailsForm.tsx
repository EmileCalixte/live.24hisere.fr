import React from "react";
import type { CustomRunnerCategory } from "@live24hisere/core/types";
import type { SelectOption } from "../../../../types/Forms";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Button } from "../../../ui/forms/Button";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";
import Select from "../../../ui/forms/Select";
import { Link } from "../../../ui/Link";

interface ParticipantDetailsFormProps {
  isBasicRanking: boolean;
  onSubmit: FormSubmitEventHandler;
  runnerOptions?: SelectOption[] | false;
  runnerId?: number | undefined;
  onRunnerChange?: React.ChangeEventHandler<HTMLSelectElement>;
  bibNumber: number | undefined;
  setBibNumber: (bibNumber: number) => void;
  isBibNumberAvailable: boolean;
  customCategories: CustomRunnerCategory[];
  customCategoryId: number | null;
  setCustomCategoryId: (id: number | null) => void;
  isStopped: boolean;
  setIsStopped: (stopped: boolean) => void;
  finalDistance: number | string;
  setFinalDistance: (distance: number | string) => void;
  submitButtonDisabled: boolean;
}

export default function ParticipantDetailsForm({
  isBasicRanking,
  onSubmit,
  runnerOptions,
  runnerId,
  onRunnerChange,
  bibNumber,
  setBibNumber,
  isBibNumberAvailable,
  customCategories,
  customCategoryId,
  setCustomCategoryId,
  isStopped,
  setIsStopped,
  finalDistance,
  setFinalDistance,
  submitButtonDisabled,
}: ParticipantDetailsFormProps): React.ReactElement {
  const customCategoryOptions = React.useMemo<Array<SelectOption<number | "_">>>(() => {
    const options: Array<SelectOption<number>> = customCategories.map((category) => ({
      label: `${category.code} – ${category.name}`,
      value: category.id,
    }));

    return [{ label: "Aucune", value: "_" }, ...options];
  }, [customCategories]);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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

      <div className="flex flex-col gap-1">
        <Select
          label="Catégorie personnalisée"
          options={customCategoryOptions}
          value={customCategoryId ?? "_"}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "_") {
              setCustomCategoryId(null);
            } else {
              setCustomCategoryId(Number(value));
            }
          }}
        />

        {customCategoryId !== null && (
          <p className="text-right">
            <Link to={`/admin/custom-runner-categories/${customCategoryId}`}>Voir la catégorie</Link>
          </p>
        )}
      </div>

      <Checkbox
        label="Arrêté"
        checked={isStopped}
        onChange={(e) => {
          setIsStopped(e.target.checked);
        }}
      />

      <Input
        label={isBasicRanking ? "Distance (m)" : "Distance après dernier passage (m)"}
        type="number"
        min={0}
        step={0.001}
        required
        name="initial-distance"
        value={finalDistance}
        onChange={(e) => {
          setFinalDistance(e.target.value);
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
