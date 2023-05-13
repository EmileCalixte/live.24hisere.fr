type InputType = Extract<import("react").HTMLInputTypeAttribute, "text" | "email" | "password" | "number">;

interface SelectOption<T extends string | number = string | number> {
    label: string;
    value: T;
}
