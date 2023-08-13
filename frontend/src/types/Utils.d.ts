// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type React = import("react");

type ReactUseStateResultWithNonNullableSetter<S> = [S, React.Dispatch<React.SetStateAction<NonNullable<S>>>];

/**
 * A string representing a date in ISO 8601 format.
 *
 * Example: 2023-12-31T12:34:56.123Z
 */
type DateISOString = string;
