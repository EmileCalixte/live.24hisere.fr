import clsx from "clsx";
import React from "react";
import { type InputType } from "../../../types/Forms";

interface InputProps {
    label: string;
    type?: InputType;
    name?: string;
    value?: string | number;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    maxLength?: number;
    pattern?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    className?: string;
    labelClassName?: string;
    inputRef?: React.LegacyRef<HTMLInputElement>;
}

export function Input({
    label,
    type = "text",
    name,
    value,
    placeholder,
    onChange,
    required = false,
    min,
    max,
    step,
    maxLength,
    pattern,
    autoComplete,
    autoFocus = false,
    className,
    labelClassName,
    inputRef,
}: InputProps): React.ReactElement {
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
                <span className={labelClassName}>{label}</span>
                <input className="input"
                       type={type}
                       name={name}
                       value={value}
                       placeholder={placeholder}
                       onChange={onChange}
                       required={required}
                       min={min}
                       max={max}
                       step={step}
                       maxLength={maxLength}
                       pattern={pattern}
                       autoFocus={autoFocus}
                       autoComplete={autoComplete}
                       ref={inputRef}
                />
            </label>
        </div>
    );
}
