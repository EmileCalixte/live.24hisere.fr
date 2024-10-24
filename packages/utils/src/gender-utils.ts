import { type Gender } from "@live24hisere/types";
import { typeUtils } from ".";

export function isValidGender(
    value: string | null | undefined,
): value is Gender {
    if (typeUtils.isNullOrUndefined(value)) {
        return false;
    }

    return value in ["M", "F"];
}
