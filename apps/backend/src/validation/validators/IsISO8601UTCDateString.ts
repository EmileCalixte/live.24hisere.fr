import { buildMessage, ValidateBy } from "class-validator";
import { ValidationOptions } from "class-validator/types/decorator/ValidationOptions";
import { dateUtils } from "@live24hisere/utils";

export const IS_ISO8601_UTC_DATE_STRING = "isISO8601UTCDateString";

export function isISO8601UTCDateString(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);

  if (!dateUtils.isDateValid(date)) {
    return false;
  }

  if (date.toISOString() === value) {
    return true;
  }

  return date.toISOString().split(".")[0] + "Z" === value;
}

/**
 * Checks if the string is a valid ISO 8601 UTC date.
 * If given value is not a string, then it returns false.
 */
export function IsISO8601UTCDateString(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ISO8601_UTC_DATE_STRING,
      validator: {
        validate: (value): boolean => isISO8601UTCDateString(value),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + "$property must be a valid ISO 8601 UTC date string",
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
