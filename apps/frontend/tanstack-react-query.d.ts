import "@tanstack/react-query";
import type { ApiError } from "./src/errors/ApiError";
import type { ApiTimeoutError } from "./src/errors/ApiTimeoutError";

interface Meta extends Record<string, unknown> {
  /**
   * A message to display in a toast when the request fails with 404 status code
   */
  notFoundToast?: string;

  /**
   * A message to display in a toast when the request fails
   */
  errorToast?: string;
}

interface MutationMeta extends Meta {
  /**
   * A message to display in a toast when the request succeeds
   */
  successToast?: string;
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: Error | ApiError | ApiTimeoutError;
    queryMeta: Meta;
    mutationMeta: MutationMeta;
  }
}
