import { arrayUtils } from "@live24hisere/utils";
import { Gender } from "../constants/gender";

export function isValidGender(
    gender: string | null | undefined,
): gender is Gender {
    return arrayUtils.inArray(gender, [Gender.M, Gender.F]);
}
