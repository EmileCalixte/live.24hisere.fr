import React from "react";
import type { GenderWithMixed } from "@live24hisere/core/types";
import { CATEGORY_SCRATCH } from "../../../../constants/category";
import type { FastestLapsShowMode } from "../../../../constants/fastestLapsShowMode";
import {
  CATEGORY_SCRATCH_SELECT_OPTION,
  FASTEST_LAPS_SHOW_MODE_OPTIONS,
  GENDER_WITH_MIXED_OPTIONS,
} from "../../../../constants/forms";
import type { SelectOption } from "../../../../types/Forms";
import { getCategoriesSelectOptions } from "../../../../utils/categoryUtils";
import RadioGroup from "../../../ui/forms/RadioGroup";
import Select from "../../../ui/forms/Select";
import TimeInputs from "../../../ui/forms/TimeInputs";

interface FastestLapsSettingsProps {
  categories: Record<string, string> | null;
  selectedCategoryCode: string | null;
  onCategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedGender: GenderWithMixed;
  onGenderSelect: (gender: GenderWithMixed) => void;
  selectedShowMode: FastestLapsShowMode;
  onShowModeSelect: (showMode: FastestLapsShowMode) => void;
  fromRaceTime: number;
  onFromRaceTimeChange: (raceTime: number) => void;
  toRaceTime: number;
  onToRaceTimeChange: (raceTime: number) => void;
  raceTime: number;
}

export default function FastestLapsSettings({
  categories,
  selectedCategoryCode,
  onCategorySelect,
  selectedGender,
  onGenderSelect,
  selectedShowMode,
  onShowModeSelect,
  fromRaceTime,
  onFromRaceTimeChange,
  toRaceTime,
  onToRaceTimeChange,
  raceTime,
}: FastestLapsSettingsProps): React.ReactElement {
  const categoriesOptions = React.useMemo<Array<SelectOption<string>>>(
    () => [CATEGORY_SCRATCH_SELECT_OPTION, ...getCategoriesSelectOptions(categories)],
    [categories],
  );

  return (
    <div className="flex flex-wrap gap-x-10 gap-y-3 print:hidden">
      <Select
        className="w-full sm:w-auto"
        label="Catégorie"
        options={categoriesOptions}
        value={selectedCategoryCode ?? CATEGORY_SCRATCH}
        onChange={onCategorySelect}
      />

      <RadioGroup
        legend="Genre"
        name="gender"
        options={GENDER_WITH_MIXED_OPTIONS}
        value={selectedGender}
        onSelectOption={(option) => {
          onGenderSelect(option.value);
        }}
      />

      <RadioGroup
        legend="Afficher"
        name="show"
        options={FASTEST_LAPS_SHOW_MODE_OPTIONS}
        value={selectedShowMode}
        onSelectOption={(option) => {
          onShowModeSelect(option.value);
        }}
      />

      <div className="flex gap-x-10 gap-y-3">
        <TimeInputs
          legend="À partir de"
          time={fromRaceTime * 1000}
          setTime={onFromRaceTimeChange}
          minTime={0}
          maxTime={raceTime * 1000}
        />

        <TimeInputs
          legend="Jusqu'à"
          time={toRaceTime * 1000}
          setTime={onToRaceTimeChange}
          minTime={0}
          maxTime={raceTime * 1000}
        />
      </div>
    </div>
  );
}
