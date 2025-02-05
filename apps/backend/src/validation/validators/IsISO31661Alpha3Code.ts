import { buildMessage, ValidateBy, ValidationOptions } from "class-validator";
import { ALPHA3_COUNTRY_CODES } from "@live24hisere/core/constants";
import { arrayUtils } from "@live24hisere/utils";

export const IS_ISO3166_1_ALPHA3_CODE = "isISO31661Alpha3Code";

export function IsISO31661Alpha3Code(validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_ISO3166_1_ALPHA3_CODE,
      validator: {
        validate: (value): boolean => arrayUtils.inArray(value, ALPHA3_COUNTRY_CODES),
        defaultMessage: buildMessage(
          (eachPrefix) => eachPrefix + "$property must be a valid ISO 3166-1 Alpha 3 country code",
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
