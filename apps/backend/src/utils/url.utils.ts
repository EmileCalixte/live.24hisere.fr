import { entries } from "./object.utils";

export function urlEncode(
    params: Record<string, string | number | boolean>,
): string {
    return entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
}
