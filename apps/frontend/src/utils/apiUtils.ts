import { type ApiRequest, type ApiRequestResult, type ApiRequestResultOk } from "../types/api/ApiRequest";

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

export async function getResponseJson<T = unknown>(response: Response): Promise<T | undefined> {
    if (response.status === 204) {
        return undefined;
    }

    return await response.json();
}

/**
 * Returns true if the api request result was OK.
 */
export function isApiRequestResultOk<T extends ApiRequest>(
    result: ApiRequestResult<T>,
): result is ApiRequestResultOk<T> {
    return result.isOk;
}
