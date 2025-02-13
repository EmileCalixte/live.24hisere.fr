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
  body?: ApiPayload<T>,
  init: Omit<RequestInit, "body"> = {},
): Promise<ApiResponse<T>> {
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

  try {
    const response = (await Promise.race([
      new Promise((resolve, reject) => {
        fetch(url, fetchInit).then(resolve).catch(reject);
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new ApiTimeoutError(`Request ${method} ${url} timed out after ${REQUEST_TIMEOUT} ms`));
        }, REQUEST_TIMEOUT);
      }),
    ])) as Response;

    verbose(`${method} ${url} response code:`, response.status);

    const responseJson = await getResponseJson<T["response"]>(response);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        responseJson,
        `Request ${init.method ?? "GET"} ${url} resulted in an HTTP ${response.status} status code`,
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
  if (!(init.headers instanceof Headers)) {
    init.headers = new Headers(init.headers);
  }

  init.headers.append("Authorization", accessToken);

  return await performApiRequest(url, body, init);
}
