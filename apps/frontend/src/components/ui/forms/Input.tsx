import React from "react";
import clsx from "clsx";
import type { InputType } from "../../../types/Forms";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: InputType;
  value?: string | number | undefined;
  className?: string;
  labelClassName?: string;
  hasError?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}

function valueToString(value: string | number | undefined): string {
  return value === undefined ? "" : value.toString();
}

export function Input({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  className,
  labelClassName,
  hasError = false,
  inputRef,
  ...props
}: InputProps): React.ReactElement {
  // TODO find a better way to improve UX of controlled number inputs
  const [internalValue, setInternalValue] = React.useState<string>(valueToString(value));

  if (type === "number" && props.pattern === undefined) {
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
    <div className={clsx("input-group", className, hasError && "error")}>
      <label>
        <span className={labelClassName}>{label}</span>
        <input
          className="input"
          type={type}
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          ref={inputRef}
          {...props}
        />
      </label>
    </div>
  );
}
