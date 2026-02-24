import React from "react";
import { cn } from "tailwind-variants";
import { COMMON_INPUT_CLASSNAME } from "../../../constants/ui/input";
import type { InputType } from "../../../types/Forms";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelPosition?: "before" | "after";
  inline?: boolean;
  type?: InputType;
  value?: string | number | undefined;
  className?: string;
  labelTextClassName?: string;
  inputClassName?: string;
  hasError?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

function valueToString(value: string | number | undefined): string {
  return value === undefined ? "" : value.toString();
}

export function Input({
  label,
  labelPosition = "before",
  inline = false,
  type = "text",
  value,
  onChange,
  onBlur,
  className,
  labelTextClassName,
  inputClassName,
  hasError = false,
  inputRef,
  ...props
}: InputProps): React.ReactElement {
  // TODO find a better way to improve UX of controlled number inputs
  const [internalValue, setInternalValue] = React.useState<string>(valueToString(value));

  if (type === "number" && props.pattern === undefined) {
    // eslint-disable-next-line no-param-reassign
    props.pattern = "[0-9]*";
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value;

    setInternalValue(newValue);

    if (e.target.validity.valid) {
      onChange?.(e);
    }
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (value !== internalValue && !e.target.validity.valid) {
      setInternalValue(valueToString(value));
    }

    onBlur?.(e);
  };

  React.useEffect(() => {
    setInternalValue(valueToString(value));
  }, [value]);

  return (
    <label className={cn("flex", inline ? "items-center" : "flex-col", className)}>
      {labelPosition === "before" && <span className={labelTextClassName}>{label}</span>}

      <input
        className={cn(COMMON_INPUT_CLASSNAME, inputClassName, hasError && "border-red-500 dark:border-red-700")}
        type={type}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        ref={inputRef}
        {...props}
      />

      {labelPosition === "after" && <span className={labelTextClassName}>{label}</span>}
    </label>
  );
}
