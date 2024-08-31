import { buildMessage, ValidateBy } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { Gender } from "@live24hisere/types";
import { genderUtils } from "@live24hisere/utils";

const IS_GENDER = "isGender";

export function isGender(value: unknown): value is Gender {
    if (typeof value !== "string") {
        return false;
    }

    return genderUtils.isValidGender(value);
}

/**
 * Checks if the string is a valid gender.
 * If given value is not a string, then it returns false.
 */
export function IsGender(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_GENDER,
            validator: {
                validate: isGender,
                defaultMessage: buildMessage(
                    (eachPrefix) =>
                        eachPrefix +
                        `$property must be one of: ${getValidGendersAsString()}`,
                    validationOptions,
                ),
            },
        },
        validationOptions,
    );
}

function getValidGendersAsString(): string {
    return Object.values(Gender)
        .map((gender) => `'${gender}'`)
        .join(", ");
}
