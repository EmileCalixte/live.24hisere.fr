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
}

export default Util;
