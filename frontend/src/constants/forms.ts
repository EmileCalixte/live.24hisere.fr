import { type SelectOption } from "../types/Forms";
import { type GenderWithMixed } from "../types/Gender";
import { CATEGORY_SCRATCH } from "./category";
import { Gender } from "./gender";
import { RankingTimeMode } from "./rankingTimeMode";

export const CATEGORY_SCRATCH_SELECT_OPTION: SelectOption = {
    label: "Scratch (toutes catégories)",
    value: CATEGORY_SCRATCH,
};

export const GENDER_OPTIONS: Array<SelectOption<Gender>> = [
    { label: "Homme", value: Gender.M },
    { label: "Femme", value: Gender.F },
];

export const GENDER_WITH_MIXED_OPTIONS: Array<SelectOption<GenderWithMixed>> = [
    { label: "Mixte", value: "mixed" },
    ...GENDER_OPTIONS,
];

export const RANKING_TIME_MODE_OPTIONS: Array<SelectOption<RankingTimeMode>> = [
    { label: "Classement actuel", value: RankingTimeMode.NOW },
    { label: "Au temps de course", value: RankingTimeMode.AT },
];
