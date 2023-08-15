import config from "../config/config";
import { type ApiRequest, type ApiRequestResult, type ApiRequestResultOk } from "../types/api/ApiRequest";
import { verbose } from "./utils";

export const EVENT_API_REQUEST_STARTED = "apiRequestStarted";
export const EVENT_API_REQUEST_ENDED = "apiRequestEnded";

/**
 * For each provided header to add, adds the header if it is not set in the existing header collection
 * @param headers The header collection
 * @param toAdd A record of headers to add if they are not present in the header collection
 */
export function addHeadersIfNotSet(headers: Headers, toAdd: Record<string, string>): void {
    Object.entries(toAdd).forEach(([headerName, headerValue]) => {
        if (!headers.has(headerName)) {
            headers.set(headerName, headerValue);
        }
    });
}

/**
 * Returns true if the api request result was OK.
 */
export function isApiRequestResultOk<T extends ApiRequest>(
    result: ApiRequestResult<T>,
): result is ApiRequestResultOk<T> {
    return result.isOk;
}

/** @deprecated */
function getBackendFullUrl(shortUrl: string): string {
    if (!shortUrl.startsWith("/")) {
        shortUrl = "/" + shortUrl;
    }

    return config.apiUrl + shortUrl;
}

/** @deprecated */
export async function performAPIRequest(url: string, init: RequestInit = {}): Promise<Response> {
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

/** @deprecated */
export async function performAuthenticatedAPIRequest(url: string, accessToken: string | null, init: RequestInit = {}): Promise<Response> {
    if ("headers" in init || !(init.headers instanceof Headers)) {
        init.headers = new Headers(init.headers);
    }

    if (accessToken) {
        init.headers.append("Authorization", accessToken);
    }

    return performAPIRequest(url, init);
}
