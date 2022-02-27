import config from '../config/config';

export const SORT_ASC = 1;
export const SORT_DESC = -1;

class Util {
    static VERBOSE_ENABLED = !!config.devMode;

    static verbose = (...items) => {
        if (!Util.VERBOSE_ENABLED) {
            return;
        }
        console.log('%c[v]', 'color: orange', ...items);
    };

    static formatDateForApi = (date) => {
        if (!(date instanceof Date)) {
            throw new Error('date must be a Date');
        }

        const year = date.getFullYear();
        const month = Util.prefixNumber(date.getMonth() + 1, 2);
        const day = Util.prefixNumber(date.getDate(), 2);
        const hours = Util.prefixNumber(date.getHours(), 2);
        const minutes = Util.prefixNumber(date.getMinutes(), 2);
        const seconds = Util.prefixNumber(date.getSeconds(), 2);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    static formatFloatNumber = (number, decimalsCount) => {
        return Number.parseFloat(number).toFixed(decimalsCount);
    }

    static formatMsAsDuration = (ms, forceDisplayHours = true) => {
        if (ms < 0) {
            return '−' + Util.formatMsAsDuration((ms - 1000) * -1);
        }

        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));

        const stringSeconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();
        const stringMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
        const stringHours = (hours < 10) ? "0" + hours.toString() : hours.toString();

        if (!forceDisplayHours && hours === 0) {
            return stringMinutes + ':' + stringSeconds;
        }

        return stringHours + ':' + stringMinutes + ':' + stringSeconds;
    }

    /**
     * Prefix a number with 0's so that the integer part of the number has at least minDigits digits
     * @param number the number to format
     * @param minDigits
     * @return {string|NaN}
     */
    static prefixNumber = (number, minDigits = 2) => {
        if (isNaN(number)) {
            return NaN;
        }

        let stringNumber = number.toString();

        const numberIsNegative = stringNumber.charAt(0) === '-';

        if (numberIsNegative) {
            stringNumber = stringNumber.substring(1);
        }

        const splittedStringNumber = stringNumber.split('.');

        let stringNumberIntPart = splittedStringNumber[0];
        const stringNumberDecimalPart = splittedStringNumber[1] ?? null;

        while (stringNumberIntPart.length < minDigits) {
            stringNumberIntPart = "0" + stringNumberIntPart;
        }

        let formattedString = numberIsNegative ? '-' : '';
        formattedString += stringNumberIntPart;

        if (stringNumberDecimalPart !== null) {
            formattedString += '.' + stringNumberDecimalPart;
        }

        return formattedString;
    }
}

export default Util;
