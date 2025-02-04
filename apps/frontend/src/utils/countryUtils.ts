import countries from "i18n-iso-countries";
import fr from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(fr);

/**
 * @param countryCode ISO 3166-1 country code (Alpha 2 or Alpha 3)
 */
export function getCountryName(countryCode: string): string | undefined {
  return countries.getName(countryCode, "fr");
}
