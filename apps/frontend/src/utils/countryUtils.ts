import countries from "i18n-iso-countries";
import fr from "i18n-iso-countries/langs/fr.json";
import { ALPHA3_TO_ALPHA2_COUNTRY_CODES } from "@live24hisere/core/constants";
import type { SelectOption } from "../types/Forms";

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

/**
 * Returns a new array of country select options, sorted alphabetically by label, with the null option first and the France option second
 * @param options
 * @returns
 */
export function sortCountryOptions(options: Array<SelectOption<string>>): Array<SelectOption<string>> {
  return [...options].sort((a, b) => {
    if (a.value === "___") return -1;
    if (b.value === "___") return 1;
    if (a.value === "FRA") return b.value === "___" ? 1 : -1;
    if (b.value === "FRA") return a.value === "___" ? -1 : 1;

    return a.label.localeCompare(b.label);
  });
}
