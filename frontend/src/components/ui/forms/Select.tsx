import clsx from "clsx";
import React from "react";
import {type SelectOption} from "../../../types/Forms";

interface SelectProps<T extends SelectOption["value"]> {
    label: string;
    name?: string;
    options: SelectOption<T>[];
    isLoading?: boolean;
    loadingOptionLabel?: string;
    value: SelectOption["value"];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
}

export default function Select<T extends SelectOption["value"]>({
    label,
    name,
    options,
    isLoading = false,
    loadingOptionLabel = "Chargement",
    value,
    onChange,
    className,
}: SelectProps<T>) {
    return (
        <div className={clsx("input-group", className)}>
            <label>
                {label}
                <select className="input-select"
                        disabled={isLoading}
                        name={name}
                        value={isLoading ? "loading" : value}
                        onChange={onChange}
                >
                    {isLoading ? (
                        <option value="loading">{loadingOptionLabel}</option>
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
