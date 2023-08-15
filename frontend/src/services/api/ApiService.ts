import config from "../../config/config";
import { DEFAULT_HEADERS, DEFAULT_HEADERS_WITH_BODY } from "../../constants/Api";
import { type ApiRequest, type ApiRequestResult } from "../../types/api/ApiRequest";
import { addHeadersIfNotSet, EVENT_API_REQUEST_ENDED, EVENT_API_REQUEST_STARTED } from "../../util/apiUtils";
import { verbose } from "../../util/utils";

function getBackendFullUrl(shortUrl: string): string {
    if (!shortUrl.startsWith("/")) {
        shortUrl = "/" + shortUrl;
    }

    return config.apiUrl + shortUrl;
}

function addDefaultHeaders(init: Omit<RequestInit, "headers"> & { headers: Headers }): void {
    if (init.body) {
        addHeadersIfNotSet(init.headers, DEFAULT_HEADERS_WITH_BODY);
    }

    addHeadersIfNotSet(init.headers, DEFAULT_HEADERS);
}

export async function performApiRequest<T extends ApiRequest>(
    url: string,
    body?: T["payload"],
    init: Omit<RequestInit, "body"> = {},
): Promise<ApiRequestResult<T>> {
    if (!url.startsWith(config.apiUrl)) {
        url = getBackendFullUrl(url);
    }

    const fetchInit = {
        ...init,
        headers: new Headers(init.headers),
        body: JSON.stringify(body),
    };

    addDefaultHeaders(fetchInit);

    const method = init.method?.toUpperCase() ?? "GET";

    verbose(`Performing request ${init.method?.toUpperCase() ?? "GET"} ${url}`);
    window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_STARTED));

    const response = await fetch(url, fetchInit);

    window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_ENDED));
    verbose(`${method} ${url} response code:`, response.status);

    let responseJson;

    try {
        responseJson = await response.json();
    } catch (error) {
        verbose("Cannot parse request response as JSON");
    }

    return {
        isOk: response.ok,
        response,
        json: responseJson,
    };
}

export async function performAuthenticatedApiRequest<T extends ApiRequest>(
    url: string,
    accessToken: string,
    body?: T["payload"],
    init: Omit<RequestInit, "body"> = {},
): Promise<ApiRequestResult<T>> {
    if (!(init.headers instanceof Headers)) {
        init.headers = new Headers(init.headers);
    }

    init.headers.append("Authorization", accessToken);

    return performApiRequest(url, body, init);
}
