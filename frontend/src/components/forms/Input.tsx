import clsx from "clsx";
import React from "react";
import {type InputType} from "../../types/Forms";

interface InputProps {
    label: string;
    type?: InputType;
    name?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    min?: string | number;
    max?: string | number;
    maxLength?: number;
    pattern?: string;
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
    maxLength,
    pattern,
    className,
}: InputProps) {
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
                       maxLength={maxLength}
                       pattern={pattern}
                />
            </label>
        </div>
    );
}
