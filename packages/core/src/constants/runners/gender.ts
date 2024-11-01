import { type Gender } from "../../types/Gender";
import { type UnionTypeRecord } from "../../types/utils/objects";

export const GENDER: UnionTypeRecord<Gender> = {
  M: "M",
  F: "F",
};

export const GENDERS = [GENDER.M, GENDER.F] as const;
