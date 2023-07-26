import config from "../config/config";
import {verbose} from "./utils";

export const EVENT_API_REQUEST_STARTED = "apiRequestStarted";
export const EVENT_API_REQUEST_ENDED = "apiRequestEnded";

function getBackendFullUrl(shortUrl: string) {
    if (!shortUrl.startsWith("/")) {
        shortUrl = "/" + shortUrl;
    }

    return config.apiUrl + shortUrl;
}

export async function performAPIRequest(url: string, init: RequestInit = {}) {
    if (!url.startsWith(config.apiUrl)) {
        url = getBackendFullUrl(url);
    }

    const method = init.method?.toUpperCase() ?? "GET";

    verbose(`Performing request ${method} ${url}`);

    window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_STARTED));

    const response = await fetch(url, init);

    window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_ENDED));

    verbose(`${method} ${url} response code:`, response.status);

    return response;
}

export async function performAuthenticatedAPIRequest(url: string, accessToken: string | null, init: RequestInit = {}) {
    if ("headers" in init || !(init.headers instanceof Headers)) {
        init.headers = new Headers(init.headers);
    }

    if (accessToken) {
        init.headers.append("Authorization", accessToken);
    }

    return await performAPIRequest(url, init);
}
