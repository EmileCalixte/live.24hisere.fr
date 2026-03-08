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

interface FastestLapsSettingsProps {
  categories: Record<string, string> | null;
  selectedCategoryCode: string | null;
  onCategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedGender: GenderWithMixed;
  onGenderSelect: (gender: GenderWithMixed) => void;
  selectedShowMode: FastestLapsShowMode;
  onShowModeSelect: (showMode: FastestLapsShowMode) => void;
}

export default function FastestLapsSettings({
  categories,
  selectedCategoryCode,
  onCategorySelect,
  selectedGender,
  onGenderSelect,
  selectedShowMode,
  onShowModeSelect,
}: FastestLapsSettingsProps): React.ReactElement {
  const categoriesOptions = React.useMemo<Array<SelectOption<string>>>(
    () => [CATEGORY_SCRATCH_SELECT_OPTION, ...getCategoriesSelectOptions(categories)],
    [categories],
  );

  return (
    <>
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
    </>
  );
}
