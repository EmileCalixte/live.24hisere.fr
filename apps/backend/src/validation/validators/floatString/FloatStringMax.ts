import { buildMessage, ValidateBy } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { isFloatString } from "./IsFloatString";

export const FLOAT_STRING_MAX = "floatStringMax";

export function floatStringMax(value: unknown, max: number): boolean {
  if (!isFloatString(value)) {
    return false;
  }

  const valueAsNumber = parseFloat(value);

  return valueAsNumber <= max;
}

/**
 * Checks if the value is lower than or equal to the allowed maximum value.
 */
export function FloatStringMax(maxValue: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: FLOAT_STRING_MAX,
      validator: {
        validate: (value): boolean => floatStringMax(value, maxValue),
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must not be greater than $constraint1`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
