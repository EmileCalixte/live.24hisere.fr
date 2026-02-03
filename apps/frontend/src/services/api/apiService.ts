import type { ApiPayload, ApiRequest, ApiResponse } from "@live24hisere/core/types";
import config from "../../config/config";
import { DEFAULT_HEADERS, DEFAULT_HEADERS_WITH_BODY, REQUEST_TIMEOUT } from "../../constants/api";
import { ApiError } from "../../errors/ApiError";
import { ApiTimeoutError } from "../../errors/ApiTimeoutError";
import {
  addHeadersIfNotSet,
  EVENT_API_REQUEST_ENDED,
  EVENT_API_REQUEST_STARTED,
  getResponseJson,
} from "../../utils/apiUtils";
import { verbose } from "../../utils/utils";

function getBackendFullUrl(shortUrl: string): string {
  let url = shortUrl;

  if (!shortUrl.startsWith("/")) {
    url = `/${url}`;
  }

  return config.apiUrl + url;
}

function addDefaultHeaders(init: Omit<RequestInit, "headers"> & { headers: Headers }): void {
  if (init.body) {
    addHeadersIfNotSet(init.headers, DEFAULT_HEADERS_WITH_BODY);
  }

  addHeadersIfNotSet(init.headers, DEFAULT_HEADERS);
}

export async function performApiRequest<T extends ApiRequest>(
  url: string,
  body?: ApiPayload<T>,
  init: Omit<RequestInit, "body"> = {},
): Promise<ApiResponse<T>> {
  let normalizedUrl = url;

  if (!url.startsWith(config.apiUrl)) {
    normalizedUrl = getBackendFullUrl(url);
  }

  const fetchInit = {
    ...init,
    headers: new Headers(init.headers),
    body: JSON.stringify(body),
  };

  addDefaultHeaders(fetchInit);

  const method = init.method?.toUpperCase() ?? "GET";

  verbose(`Performing request ${init.method?.toUpperCase() ?? "GET"} ${normalizedUrl}`);
  window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_STARTED));

  try {
    const response = (await Promise.race([
      new Promise((resolve, reject) => {
        fetch(normalizedUrl, fetchInit).then(resolve).catch(reject);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new ApiTimeoutError(`Request ${method} ${normalizedUrl} timed out after ${REQUEST_TIMEOUT} ms`));
        }, REQUEST_TIMEOUT);
      }),
    ])) as Response;

    verbose(`${method} ${normalizedUrl} response code:`, response.status);

    const responseJson = await getResponseJson<T["response"]>(response);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseJson,
        `Request ${init.method ?? "GET"} ${normalizedUrl} resulted in an HTTP ${response.status} status code`,
      );
    }

    return responseJson;
  } finally {
    window.dispatchEvent(new CustomEvent(EVENT_API_REQUEST_ENDED));
  }
}

export async function performAuthenticatedApiRequest<T extends ApiRequest>(
  url: string,
  accessToken: string,
  body?: ApiPayload<T>,
  init: Omit<RequestInit, "body"> = {},
): Promise<ApiResponse<T>> {
  const requestInit = structuredClone(init);

  if (!(requestInit.headers instanceof Headers)) {
    requestInit.headers = new Headers(init.headers);
  }

  requestInit.headers.append("Authorization", accessToken);

  return await performApiRequest(url, body, requestInit);
}
