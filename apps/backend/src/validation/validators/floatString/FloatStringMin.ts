import { buildMessage, ValidateBy } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { isFloatString } from "./IsFloatString";

export const FLOAT_STRING_MIN = "floatStringMin";

export function floatStringMin(value: unknown, min: number): boolean {
  if (!isFloatString(value)) {
    return false;
  }

  const valueAsNumber = parseFloat(value);

  return valueAsNumber >= min;
}

/**
 * Checks if the value is greater than or equal to the allowed minimum value.
 */
export function FloatStringMin(minValue: number, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: FLOAT_STRING_MIN,
      validator: {
        validate: (value): boolean => floatStringMin(value, minValue),
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must not be less than $constraint1`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
