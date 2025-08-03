import { GENDER } from "@live24hisere/core/constants";

export const CATEGORY_COLORS: Record<string, string> = {
  ES: "#df7970",
  SE: "#d6975a",
  M0: "#d6d55a",
  M1: "#9ad65a",
  V1: "#9ad65a",
  M2: "#5dd65a",
  M3: "#5ad695",
  V2: "#5ad695",
  M4: "#5ad6d2",
  M5: "#5a76d6",
  V3: "#5a76d6",
  M6: "#6c5ad6",
  M7: "#9a5ad6",
  V4: "#9a5ad6",
  M8: "#d65ab6",
  M9: "#d65a88",
  V5: "#d65a88",
  M10: "#d65a5a",
  custom: "#aaccaa",
} as const;

export const GENDER_COLORS = {
  [GENDER.M]: "#5a79d6",
  [GENDER.F]: "#d65a5a",
};
