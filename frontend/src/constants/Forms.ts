import {CATEGORY_SCRATCH} from "./Category";
import {GENDER} from "./Gender";
import {RANKING_TIME_MODE} from "./RankingTimeMode";

export const CATEGORY_SCRATCH_SELECT_OPTION: SelectOption = {
    label: "Scratch (toutes catégories)",
    value: CATEGORY_SCRATCH,
};

export const GENDER_OPTIONS: SelectOption<Gender>[] = [
    {label: "Homme", value: GENDER.M},
    {label: "Femme", value: GENDER.F},
];

export const GENDER_WITH_MIXED_OPTIONS: SelectOption<GenderWithMixed>[] = [
    {label: "Mixte", value: "mixed"},
    ...GENDER_OPTIONS,
];

export const RANKING_TIME_MODE_OPTIONS: SelectOption<RankingTimeMode>[] = [
    {label: "Classement actuel", value: RANKING_TIME_MODE.now},
    {label: "Au temps de course", value: RANKING_TIME_MODE.at},
];