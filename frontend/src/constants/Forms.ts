import {type SelectOption} from "../types/Forms";
import {Gender} from "../types/Runner";

export const GENDER_OPTIONS: SelectOption<Gender>[] = [
    {label: "Homme", value: Gender.M},
    {label: "Femme", value: Gender.F},
];
