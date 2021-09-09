import config from '../config/config';


class Util {
    static VERBOSE_ENABLED = !!config.devMode;

    static verbose = (...items) => {
        if (!Util.VERBOSE_ENABLED) {
            return;
        }
        console.log('%c[v]', 'color: orange', ...items);
    };

    static formatFloatNumber = (number, decimalsCount) => {
        return Number.parseFloat(number).toFixed(decimalsCount);
    }

    static formatMsAsDuration = (ms) => {
        if (ms < 0) {
            return '−' + Util.formatMsAsDuration((ms - 1000) * -1);
        }

        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)));

        const stringSeconds = (seconds < 10) ? "0" + seconds.toString() : seconds.toString();
        const stringMinutes = (minutes < 10) ? "0" + minutes.toString() : minutes.toString();
        const stringHours = (hours < 10) ? "0" + hours.toString() : hours.toString();

        return stringHours + ':' + stringMinutes + ':' + stringSeconds;
    }
}

export default Util;
