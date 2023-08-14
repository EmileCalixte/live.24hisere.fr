// eslint-disable-next-line @typescript-eslint/consistent-type-imports
export type InputType = Extract<import("react").HTMLInputTypeAttribute, "text" | "email" | "password" | "number">;

export interface SelectOption<T extends string | number = string | number> {
    label: string;
    value: T;
}
