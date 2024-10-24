import { type Gender } from "@live24hisere/types";
import { type UnionTypeRecord } from "@live24hisere/types/utils";

export const GENDER: UnionTypeRecord<Gender> = {
    M: "M",
    F: "F",
};

export const GENDERS = [GENDER.M, GENDER.F] as const;
