import { GENDERS } from "@live24hisere/constants/runners";
import { type Gender } from "@live24hisere/types";
import { arrayUtils, typeUtils } from ".";

export function isValidGender(
    value: string | null | undefined,
): value is Gender {
    if (typeUtils.isNullOrUndefined(value)) {
        return false;
    }

    return arrayUtils.inArray(value, GENDERS);
}
