import clsx from "clsx";
import React from "react";

interface SelectProps<T extends SelectOption["value"]> {
    label: string;
    name?: string;
    options: SelectOption<T>[];
    disabled?: boolean;
    isLoading?: boolean;
    loadingOptionLabel?: string;
    placeholderLabel?: string;
    value?: SelectOption["value"];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
}

export default function Select<T extends SelectOption["value"]>({
    label,
    name,
    options,
    disabled = false,
    isLoading = false,
    loadingOptionLabel = "Chargement",
    placeholderLabel = "",
    value,
    onChange,
    className,
}: SelectProps<T>) {
    return (
        <div className={clsx("input-group", className)}>
            <label>
                {label}
                <select className="input-select"
                        disabled={disabled || isLoading}
                        name={name}
                        value={isLoading ? "_loading" : value ?? "_placeholder"}
                        onChange={onChange}
                >
                    <option disabled hidden value="_placeholder">{placeholderLabel}</option>
                    {isLoading ? (
                        <option value="_loading">{loadingOptionLabel}</option>
                    ) : (
                        <>
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))}
                        </>
                    )}
                </select>
            </label>
        </div>
    );
}
