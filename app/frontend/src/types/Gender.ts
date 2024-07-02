import { type Gender } from "../constants/gender";

/**
 * Represents the gender of a runner with an additionnal "mixed" option
 */
export type GenderWithMixed = Gender | "mixed";
