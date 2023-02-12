import config from '../config/config';
import Util from "./Util";

export const EVENT_API_REQUEST_STARTED = "apiRequestStarted";
export const EVENT_API_REQUEST_ENDED = "apiRequestEnded";

class ApiUtil {
    static APP_BACKEND_URL = config.apiUrl

    /**
     * Fetch minimal wrapper with verbose
     * @param {string} url
     * @param {RequestInit} init
     * @returns {Promise<Response>}
     */
    static fetch = async (url: string, init: RequestInit) => {
        let method = 'GET';
        if (init.hasOwnProperty('method') && typeof init.method === 'string') {
            method = init.method.toUpperCase();
        }

        Util.verbose(`Performing request ${method} ${url}`);

        const response = await fetch(url, init);

        Util.verbose(`${method} ${url} response code:`, response.status);

        return response;
    }

    static getBackendFullUrl = (shortUrl: string) => {
        if (!shortUrl.startsWith('/')) {
            shortUrl = '/' + shortUrl;
        }

        return ApiUtil.APP_BACKEND_URL + shortUrl;
    }

    /**
     * @param {string} url
     * @param {RequestInit} init
     * @return {Promise<Response>}
     */
    static performAPIRequest = async (url: string, init: RequestInit = {}) => {
        if (!url.startsWith(ApiUtil.APP_BACKEND_URL)) {
            url = ApiUtil.getBackendFullUrl(url);
        }

        console.log("DISPATCH STARTED EVENT");
        window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_STARTED));

        const response = await ApiUtil.fetch(url, init);

        console.log("DISPATCH ENDED EVENT");
        window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_ENDED));

        return response;
    }

    /**
     * @param {string} url
     * @param {string|null} accessToken
     * @param {RequestInit} init
     * @return {Promise<Response>}
     */
    static performAuthenticatedAPIRequest = async (url: string, accessToken: string | null, init: RequestInit = {}) => {
        if (!init.hasOwnProperty('headers') || !(init.headers instanceof Headers)) {
            init.headers = new Headers();
        }

        if (accessToken) {
            init.headers.append('Authorization', accessToken);
        }

        return ApiUtil.performAPIRequest(url, init);
    }
}

export default ApiUtil;
