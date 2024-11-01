import type React from "react";

export type ReactStateSetter<S> = React.Dispatch<React.SetStateAction<S>>;

/**
 * A react state whose initial value can be zero but whose setter parameter cannot be
 */
export type ReactUseStateResultWithNonNullableSetter<S> = [S, React.Dispatch<React.SetStateAction<NonNullable<S>>>];
