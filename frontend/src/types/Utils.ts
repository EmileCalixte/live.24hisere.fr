import type React from "react";

export type ReactUseStateResultWithNonNullableSetter<S> = [S, React.Dispatch<React.SetStateAction<NonNullable<S>>>];

/**
 * A string representing a date in ISO 8601 format.
 *
 * Example: 2023-12-31T12:34:56.123Z
 */
export type DateISOString = string;
