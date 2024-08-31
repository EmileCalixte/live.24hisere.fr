import type React from "react";

export type ReactStateSetter<S> = React.Dispatch<React.SetStateAction<S>>;

export type ReactUseStateResultWithNonNullableSetter<S> = [
    S,
    React.Dispatch<React.SetStateAction<NonNullable<S>>>,
];
