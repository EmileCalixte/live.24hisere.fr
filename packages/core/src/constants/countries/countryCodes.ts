import { getAlpha2Codes, getAlpha3Codes } from "i18n-iso-countries";

export const ALPHA2_TO_ALPHA3_COUNTRY_CODES = getAlpha2Codes();
export const ALPHA3_TO_ALPHA2_COUNTRY_CODES = getAlpha3Codes();

export const ALPHA2_COUNTRY_CODES = Object.keys(ALPHA2_TO_ALPHA3_COUNTRY_CODES);
export const ALPHA3_COUNTRY_CODES = Object.keys(ALPHA3_TO_ALPHA2_COUNTRY_CODES);
