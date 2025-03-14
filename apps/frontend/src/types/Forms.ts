import type { HTMLInputTypeAttribute } from "react";

export type InputType = Extract<
  HTMLInputTypeAttribute,
  "text" | "email" | "password" | "number" | "file" | "date" | "time"
>;

export interface SelectOption<TValue extends string | number = string | number> {
  label: string;
  value: TValue;
  disabled?: boolean;
}
