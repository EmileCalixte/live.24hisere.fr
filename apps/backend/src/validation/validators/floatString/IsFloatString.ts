import { buildMessage, ValidateBy } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";

const IS_FLOAT_STRING = "isFLoatString";

export function isFloatString(value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }

    if (!value.match(/^\d+(\.\d+)?$/)) {
        return false;
    }

    const valueAsNumber = parseFloat(value);

    if (isNaN(valueAsNumber)) {
        return false;
    }

    return true;
}

/**
 * Checks if the string is a valid float number.
 * If given value is not a string, then it returns false.
 */
export function IsFloatString(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return ValidateBy(
        {
            name: IS_FLOAT_STRING,
            validator: {
                validate: (value): boolean => isFloatString(value),
                defaultMessage: buildMessage(
                    (eachPrefix) =>
                        eachPrefix +
                        "$property must be a string representing a valid decimal number",
                ),
            },
        },
        validationOptions,
    );
}
