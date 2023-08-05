import { buildMessage, ValidateBy } from "class-validator";
import { type ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { GENDER } from "../../constants/gender.constants";
import { Gender } from "../../types/Gender";

const IS_GENDER = "isGender";

export function isGender(value: unknown): value is Gender {
    if (typeof value !== "string") {
        return false;
    }

    return value in GENDER;
}

/**
 * Checks if the string is a valid gender.
 * If given value is not a string, then it returns false.
 */
export function IsGender(validationOptions?: ValidationOptions): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_GENDER,
            validator: {
                validate: isGender,
                defaultMessage: buildMessage(
                    eachPrefix => eachPrefix + `$property must be one of: ${getValidGendersAsString()}`,
                    validationOptions,
                ),
            },
        },
        validationOptions,
    );
}

function getValidGendersAsString(): string {
    return Object.values(GENDER)
        .map(gender => `'${gender}'`)
        .join(", ");
}
