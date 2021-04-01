import config from '../config/config';
import Util from "./Util";

class ApiUtil {
    static APP_BACKEND_URL = config.apiUrl

    /**
     * Fetch minimal wrapper with verbose
     * @param url
     * @param init
     * @returns {Response}
     */
    static fetch = async (url, init) => {
        let method = 'GET';
        if (init.hasOwnProperty('method')) {
            method = init.method.toUpperCase();
        }

        Util.verbose(`Performing request ${method} ${url}`);

        const response = await fetch(url, init);

        Util.verbose(`${method} ${url} response code:`, response.status);

        return response;
    }

    static getBackendFullUrl = (shortUrl) => {
        if (!shortUrl.startsWith('/')) {
            shortUrl = '/' + shortUrl;
        }

        return ApiUtil.APP_BACKEND_URL + shortUrl;
    }

    /**
     * @param url
     * @param init
     * @returns {Response}
     */
    static performAPIRequest = async (url, init = {}) => {
        if (!url.startsWith(ApiUtil.APP_BACKEND_URL)) {
            url = ApiUtil.getBackendFullUrl(url);
        }

        return await ApiUtil.fetch(url, init);
    }
}

export default ApiUtil;
