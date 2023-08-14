import { type Gender, type GenderWithMixed } from "../types/Gender";
import { type ConstantRecord } from "../types/Utils";

export const GENDER: ConstantRecord<Gender> = {
    M: "M",
    F: "F",
};

export const GENDER_MIXED: GenderWithMixed = "mixed";
