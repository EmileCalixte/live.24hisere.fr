import type React from "react";
import clsx from "clsx";
import type { InputType } from "../../../types/Forms";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: InputType;
  value?: string | number | undefined;
  className?: string;
  labelClassName?: string;
  hasError?: boolean;
  inputRef?: React.LegacyRef<HTMLInputElement>;
}

export function Input({
  label,
  type = "text",
  onChange,
  className,
  labelClassName,
  hasError = false,
  inputRef,
  ...props
}: InputProps): React.ReactElement {
  if (type === "number" && props.pattern === undefined) {
    props.pattern = "[0-9]*";

    if (onChange) {
      const propsOnChange = onChange;
      onChange = (e) => {
        if (!e.target.validity.valid) {
          return;
        }

        propsOnChange(e);
      };
    }
  }

  return (
    <div className={clsx("input-group", className, hasError && "error")}>
      <label>
        <span className={labelClassName}>{label}</span>
        <input className="input" type={type} onChange={onChange} ref={inputRef} {...props} />
      </label>
    </div>
  );
}
