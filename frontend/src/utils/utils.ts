import config from "../config/config";

export const SORT_ASC = 1;
export const SORT_DESC = -1;

export function verbose(...items: unknown[]): void {
    if (!config.devMode) {
        return;
    }

    console.log("%c[v]", "color: orange", ...items);
}

export function formatDateForApi(date: Date): string {
    return date.toISOString();
}

export function isDateValid(date: Date): boolean {
    return !isNaN(date.getTime());
}

/**
 * Returns true if value is null or undefined
 * @param value
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value === null || value === undefined;
}

export function formatDateAsString(date: Date, dateAndTimeSeparator = ", ", dateSeparator = "/", timeSeparator = ":"): string {
    if (!isDateValid(date)) {
        return date.toString();
    }

    const dateString = getDateStringFromDate(date, dateSeparator);
    const timeString = getTimeStringFromDate(date, timeSeparator);

    return `${dateString}${dateAndTimeSeparator}${timeString}`;
}

export function getDateStringFromDate(date: Date, separator = "/"): string {
    if (!isDateValid(date)) {
        return "";
    }

    const year = date.getFullYear();
    const month = prefixNumber(date.getMonth() + 1, 2);
    const day = prefixNumber(date.getDate(), 2);

    return `${day}${separator}${month}${separator}${year}`;
}

export function getTimeStringFromDate(date: Date, separator = ":"): string {
    if (!isDateValid(date)) {
        return "";
    }

    const hours = prefixNumber(date.getHours(), 2);
    const minutes = prefixNumber(date.getMinutes(), 2);
    const seconds = prefixNumber(date.getSeconds(), 2);

    return `${hours}${separator}${minutes}${separator}${seconds}`;
}

export function formatFloatNumber(number: number, decimalsCount: number): string {
    return number.toFixed(decimalsCount);
}

export function formatMsAsDuration(ms: number, forceDisplayHours = true): string {
    if (ms < 0) {
        return "−" + formatMsAsDuration((ms - 1000) * -1);
    }

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));

    const stringSeconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();
    const stringMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
    const stringHours = (hours < 10) ? "0" + hours.toString() : hours.toString();

    if (!forceDisplayHours && hours === 0) {
        return stringMinutes + ":" + stringSeconds;
    }

    return stringHours + ":" + stringMinutes + ":" + stringSeconds;
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

    const numberIsNegative = stringNumber.charAt(0) === "-";

    if (numberIsNegative) {
        stringNumber = stringNumber.substring(1);
    }

    const splittedStringNumber = stringNumber.split(".");

    let stringNumberIntPart = splittedStringNumber[0];
    const stringNumberDecimalPart = splittedStringNumber[1] ?? null;

    while (stringNumberIntPart.length < minDigits) {
        stringNumberIntPart = "0" + stringNumberIntPart;
    }

    let formattedString = numberIsNegative ? "-" : "";
    formattedString += stringNumberIntPart;

    if (stringNumberDecimalPart !== null) {
        formattedString += "." + stringNumberDecimalPart;
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
