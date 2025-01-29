/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/non-nullable-type-assertion-style */
import { useParams } from "react-router-dom";

export function useRequiredParams<TKey extends string>(keys: readonly TKey[]): Record<TKey, string> {
  const params = useParams();

  const missingKeys = keys.filter((key) => !(key in params));

  if (missingKeys.length > 0) {
    throw new Error(`Missing required URL parameters: ${missingKeys.join(", ")}`);
  }

  return keys.reduce(
    (acc, key) => {
      acc[key] = params[key] as string;
      return acc;
    },
    {} as Record<TKey, string>,
  );
}
