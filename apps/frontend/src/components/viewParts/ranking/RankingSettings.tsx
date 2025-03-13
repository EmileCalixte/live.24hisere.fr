import React from "react";
import type { CategoryCode, CategoryList } from "@emilecalixte/ffa-categories";
import type { GenderWithMixed } from "@live24hisere/core/types";
import { CATEGORY_SCRATCH } from "../../../constants/category";
import {
  CATEGORY_SCRATCH_SELECT_OPTION,
  GENDER_WITH_MIXED_OPTIONS,
  RANKING_TIME_MODE_OPTIONS,
  RANKING_TIME_MODE_RACE_FINISHED_OPTIONS,
} from "../../../constants/forms";
import { RankingTimeMode } from "../../../constants/rankingTimeMode";
import type { SelectOption } from "../../../types/Forms";
import { getCategoriesSelectOptions } from "../../../utils/categoryUtils";
import RadioGroup from "../../ui/forms/RadioGroup";
import Select from "../../ui/forms/Select";
import RankingSettingsTime from "./RankingSettingsTime";

interface RankingSettingsProps {
  categories: CategoryList | null;
  onCategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGenderSelect: (gender: GenderWithMixed) => void;
  setTimeMode: (timeMode: RankingTimeMode) => void;
  onRankingTimeSave: (time: number) => void;
  selectedCategoryCode: CategoryCode | null;
  selectedGender: GenderWithMixed;
  showTimeModeSelect: boolean;
  selectedTimeMode: RankingTimeMode;
  currentRankingTime: number;
  maxRankingTime: number;
  isRaceFinished: boolean;
}

export default function RankingSettings({
  categories,
  onCategorySelect,
  onGenderSelect,
  setTimeMode,
  onRankingTimeSave,
  selectedCategoryCode,
  selectedGender,
  showTimeModeSelect,
  selectedTimeMode,
  currentRankingTime,
  maxRankingTime,
  isRaceFinished,
}: RankingSettingsProps): React.ReactElement {
  const categoriesOptions = React.useMemo<Array<SelectOption<CategoryCode | "scratch">>>(
    () => [CATEGORY_SCRATCH_SELECT_OPTION, ...getCategoriesSelectOptions(categories)],
    [categories],
  );

  const rankingTimeModeOptions = isRaceFinished ? RANKING_TIME_MODE_RACE_FINISHED_OPTIONS : RANKING_TIME_MODE_OPTIONS;

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
        options={GENDER_WITH_MIXED_OPTIONS}
        value={selectedGender}
        onSelectOption={(option) => {
          onGenderSelect(option.value);
        }}
      />

      {showTimeModeSelect && (
        <div>
          <RadioGroup
            legend="Heure"
            options={rankingTimeModeOptions}
            value={selectedTimeMode}
            onSelectOption={(option) => {
              setTimeMode(option.value);
            }}
          />

          <RankingSettingsTime
            isVisible={selectedTimeMode === RankingTimeMode.AT}
            currentRankingTime={currentRankingTime}
            onRankingTimeSave={onRankingTimeSave}
            maxRankingTime={maxRankingTime}
          />
        </div>
      )}
    </>
  );
}
