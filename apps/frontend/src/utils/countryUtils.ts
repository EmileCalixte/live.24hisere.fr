import countries from "i18n-iso-countries";
import fr from "i18n-iso-countries/langs/fr.json";
import { ALPHA3_TO_ALPHA2_COUNTRY_CODES } from "@live24hisere/core/constants";

countries.registerLocale(fr);

/**
 * @param countryCode ISO 3166-1 country code (Alpha 2 or Alpha 3)
 */
export function getCountryName(countryCode: string): string | undefined {
  return countries.getName(countryCode, "fr");
}

export function getCountryAlpha2CodeFromAlpha3Code(alpha3Code: string | null): string | null {
  if (!alpha3Code) {
    return null;
  }

  return ALPHA3_TO_ALPHA2_COUNTRY_CODES[alpha3Code] ?? null;
}
