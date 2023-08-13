import clsx from "clsx";
import React from "react";

interface InputProps {
    label: string;
    type?: InputType;
    name?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    maxLength?: number;
    pattern?: string;
    autoFocus?: boolean;
    className?: string;
}

export function Input({
    label,
    type = "text",
    name,
    value,
    onChange,
    required = false,
    min,
    max,
    step,
    maxLength,
    pattern,
    autoFocus = false,
    className,
}: InputProps): JSX.Element {
    if (type === "number" && pattern === undefined) {
        pattern = "[0-9]*";

        if (onChange) {
            const propsOnChange = onChange;
            onChange = e => {
                if (!e.target.validity.valid) {
                    return;
                }

                propsOnChange(e);
            };
        }
    }

    return (
        <div className={clsx("input-group", className)}>
            <label>
                {label}
                <input className="input"
                       type={type}
                       name={name}
                       value={value}
                       onChange={onChange}
                       required={required}
                       min={min}
                       max={max}
                       step={step}
                       maxLength={maxLength}
                       pattern={pattern}
                       autoFocus={autoFocus}
                />
            </label>
        </div>
    );
}
