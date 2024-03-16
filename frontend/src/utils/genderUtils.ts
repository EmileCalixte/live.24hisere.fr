import { Gender } from "../constants/gender";
import { inArray } from "./arrayUtils";

export function isValidGender(gender: string | null | undefined): gender is Gender {
    return inArray(gender, [Gender.M, Gender.F]);
}
