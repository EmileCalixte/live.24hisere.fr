import clsx from "clsx";
import React from "react";

interface CheckboxProps {
    label: string;
    checked: boolean;
    name?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function Checkbox({
    label,
    checked,
    name,
    onChange,
    className,
}: CheckboxProps): React.ReactElement {
    return (
        <div className={clsx("inline-input-group", className)}>
            <label className="input-checkbox">
                <input type="checkbox"
                       name={name}
                       checked={checked}
                       onChange={onChange}
                />
                <span />
                {label}
            </label>
        </div>
    );
}
