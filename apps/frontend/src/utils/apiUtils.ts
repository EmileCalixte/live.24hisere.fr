import type { Mutation, Query } from "@tanstack/react-query";
import type { ApiRequest, ApiRequestResultLegacy, ApiRequestResultOk } from "@live24hisere/core/types";
import { ApiError } from "../errors/ApiError";
import type { ApiTimeoutError } from "../errors/ApiTimeoutError";

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
  result: ApiRequestResultLegacy<T>,
): result is ApiRequestResultOk<T> {
  return result.isOk;
}

export function getErrorMessageToDisplay(
  error: Error | ApiError | ApiTimeoutError,
  query: Query<unknown, unknown, unknown> | Mutation<unknown, unknown>,
): string | null {
  const is404 = error instanceof ApiError && error.statusCode === 404;

  const meta = query.meta;

  if (is404) {
    return meta?.notFoundToast ?? meta?.errorToast ?? null;
  }

  return meta?.errorToast ?? null;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function is404Error(error: unknown): error is ApiError {
  return isApiError(error) && error.statusCode === 404;
}
