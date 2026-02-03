import { dateUtils } from "@live24hisere/utils";
import config from "../config/config";

export function verbose(...items: unknown[]): void {
  if (!config.devMode) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log("%c[v]", "color: orange", ...items);
}

export function formatDateForApi(date: Date): string {
  return date.toISOString();
}

export function formatDateAsString(
  date: Date,
  dateAndTimeSeparator = ", ",
  dateSeparator = "/",
  timeSeparator = ":",
): string {
  if (!dateUtils.isDateValid(date)) {
    return date.toString();
  }

  const dateString = getDateStringFromDate(date, dateSeparator);
  const timeString = getTimeStringFromDate(date, timeSeparator);

  return `${dateString}${dateAndTimeSeparator}${timeString}`;
}

export function getDateStringFromDate(date: Date, separator = "/"): string {
  if (!dateUtils.isDateValid(date)) {
    return "";
  }

  const year = date.getFullYear();
  const month = prefixNumber(date.getMonth() + 1, 2);
  const day = prefixNumber(date.getDate(), 2);

  return `${day}${separator}${month}${separator}${year}`;
}

export function getTimeStringFromDate(date: Date, separator = ":"): string {
  if (!dateUtils.isDateValid(date)) {
    return "";
  }

  const hours = prefixNumber(date.getHours(), 2);
  const minutes = prefixNumber(date.getMinutes(), 2);
  const seconds = prefixNumber(date.getSeconds(), 2);

  return `${hours}${separator}${minutes}${separator}${seconds}`;
}

export function formatFloatNumber(number: number, decimalsCount: number): string {
  return new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: decimalsCount,
    maximumFractionDigits: decimalsCount,
  }).format(number);
}

/**
 * Prefix a number with 0's so that the integer part of the number has at least minDigits digits
 * @return {string|NaN}
 */
export function prefixNumber(number: number, minDigits = 2): string | typeof NaN {
  if (isNaN(number)) {
    return NaN;
  }

  let stringNumber = number.toString();

  const numberIsNegative = stringNumber.startsWith("-");

  if (numberIsNegative) {
    stringNumber = stringNumber.substring(1);
  }

  const splittedStringNumber = stringNumber.split(".");

  let stringNumberIntPart = splittedStringNumber[0];
  const stringNumberDecimalPart = splittedStringNumber.length > 1 ? splittedStringNumber[1] : null;

  while (stringNumberIntPart.length < minDigits) {
    stringNumberIntPart = `0${stringNumberIntPart}`;
  }

  let formattedString = numberIsNegative ? "-" : "";
  formattedString += stringNumberIntPart;

  if (stringNumberDecimalPart !== null) {
    formattedString += `.${stringNumberDecimalPart}`;
  }

  return formattedString;
}

/**
 * Returns a map from an array of objects
 * @param array the source array
 * @param indexKey The property name of the array objects that will become map keys. Each object should have a unique value for this property.
 */
export function objectArrayToMap<T extends object, K extends keyof T>(array: T[], indexKey: K): Map<T[K], T> {
  const map = new Map<T[K], T>();

  for (const item of array) {
    map.set(item[indexKey], item);
  }

  return map;
}

export function getObjectKeys<T extends object>(object: T): Array<keyof T> {
  return Object.keys(object) as Array<keyof T>;
}
