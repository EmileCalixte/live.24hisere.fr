import { type HTMLInputTypeAttribute } from "react";

export type InputType = Extract<HTMLInputTypeAttribute, "text" | "email" | "password" | "number" | "file">;

export interface SelectOption<T extends string | number = string | number> {
    label: string;
    value: T;
}
