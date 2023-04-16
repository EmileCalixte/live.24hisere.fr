import clsx from "clsx";
import React from "react";
import {type SelectOption} from "../../types/Forms";
import OptionWithLoadingDots from "./OptionWithLoadingDots";

interface SelectProps<T extends SelectOption["value"]> {
    label: string;
    name?: string;
    options: SelectOption<T>[];
    displayLoadingOption?: boolean;
    loadingOptionLabel?: string;
    value: SelectOption["value"];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
}

export default function Select<T extends SelectOption["value"]>({
    label,
    name,
    options,
    displayLoadingOption = false,
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
                        name={name}
                        value={value}
                        onChange={onChange}
                >
                    {displayLoadingOption &&
                        <OptionWithLoadingDots>{loadingOptionLabel}</OptionWithLoadingDots>
                    }
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </label>
        </div>
    );
}
