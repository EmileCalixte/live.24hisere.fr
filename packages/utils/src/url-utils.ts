import { entries } from "./object-utils";

/**
 * Encodes an object of key-value pairs into a URI query string
 * @param params The params to encode
 * @returns The url-encoded string
 */
export function encode(params: Record<string, string | number | boolean>): string {
  return entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
}
