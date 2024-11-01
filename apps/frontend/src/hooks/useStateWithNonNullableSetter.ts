import { useState } from "react";
import { type ReactUseStateResultWithNonNullableSetter } from "../types/utils/react";

/**
 * Returns a stateful value, and a function to update it but this function cannot take null or undefined as parameter.
 *
 * Note: as this is a custom hook, the setter should appear in the dependency array of the hooks in which it's used
 * ({@link https://stackoverflow.com/a/57180908/13208770})
 * @param initialState
 */
export function useStateWithNonNullableSetter<S>(
  initialState: S | (() => S),
): ReactUseStateResultWithNonNullableSetter<S> {
  return useState<S>(initialState) as ReactUseStateResultWithNonNullableSetter<S>;
}
