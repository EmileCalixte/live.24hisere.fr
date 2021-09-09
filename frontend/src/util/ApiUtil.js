import config from '../config/config';
import Util from "./Util";
import App from "../components/App";

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
     * @param saveMetadata
     * @returns {Response}
     */
    static performAPIRequest = async (url, init = {}, saveMetadata = true) => {
        if (!url.startsWith(ApiUtil.APP_BACKEND_URL)) {
            url = ApiUtil.getBackendFullUrl(url);
        }

        const response = await ApiUtil.fetch(url, init);

        if (saveMetadata) {
            await ApiUtil.saveMetadata(response);
        }

        return response;
    }

    static saveMetadata = async (fetchResponse) => {
        try {
            const responseClone = fetchResponse.clone();

            const responseJson = await responseClone.json();
            const metadata = responseJson.metadata;

            App.FIRST_LAP_DISTANCE = metadata.firstLapDistance;
            App.LAP_DISTANCE = metadata.lapDistance;
            App.RACE_START_TIME = new Date(metadata.raceStartTime);
            App.LAST_UPDATE_TIME = new Date(metadata.lastUpdateTime);
        } catch (e) {
            console.error('Unable to save response metadata');
            console.error(e);
        }
    }
}

export default ApiUtil;
