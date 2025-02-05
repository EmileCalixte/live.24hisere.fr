import { ALPHA3_COUNTRY_CODES, GENDER } from "@live24hisere/core/constants";
import type { Gender, GenderWithMixed } from "@live24hisere/core/types";
import type { SelectOption } from "../types/Forms";
import { getCountryName } from "../utils/countryUtils";
import { CATEGORY_SCRATCH } from "./category";
import { RankingTimeMode } from "./rankingTimeMode";

export const CATEGORY_SCRATCH_SELECT_OPTION: SelectOption<"scratch"> = {
  label: "Scratch (toutes catégories)",
  value: CATEGORY_SCRATCH,
};

export const GENDER_OPTIONS: Array<SelectOption<Gender>> = [
  { label: "Homme", value: GENDER.M },
  { label: "Femme", value: GENDER.F },
];

export const GENDER_WITH_MIXED_OPTIONS: Array<SelectOption<GenderWithMixed>> = [
  { label: "Mixte", value: "mixed" },
  ...GENDER_OPTIONS,
];

export const RANKING_TIME_MODE_OPTIONS: Array<SelectOption<RankingTimeMode>> = [
  { label: "Classement actuel", value: RankingTimeMode.NOW },
  { label: "Au temps de course", value: RankingTimeMode.AT },
];

export const COUNTRY_OPTIONS: Array<SelectOption<string>> = [
  ...ALPHA3_COUNTRY_CODES.map((countryCode) => {
    const countryName = getCountryName(countryCode);

    if (!countryName) {
      return null;
    }

    return {
      label: countryName,
      value: countryCode,
    };
  }).filter((option) => option !== null),
];

export const COUNTRY_NULL_OPTION_VALUE = "___";

export const COUNTRY_OPTIONS_WITH_NULL: Array<SelectOption<string>> = [
  { label: "(Pas de pays)", value: COUNTRY_NULL_OPTION_VALUE },
  ...COUNTRY_OPTIONS,
];
