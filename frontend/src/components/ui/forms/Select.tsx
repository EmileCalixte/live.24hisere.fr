import clsx from "clsx";
import React from "react";
import { type SelectOption } from "../../../types/Forms";

export interface SelectProps<T extends SelectOption["value"]> {
    label: string;
    name?: string;
    options: Array<SelectOption<T>>;
    disabled?: boolean;
    isLoading?: boolean;
    loadingOptionLabel?: string;
    placeholderLabel?: string;
    value?: SelectOption["value"];
    onChange?: React.ChangeEventHandler<HTMLSelectElement>;
    onMouseDown?: React.MouseEventHandler<HTMLSelectElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLSelectElement>;
    className?: string;
    selectRef?: React.LegacyRef<HTMLSelectElement>;
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
    onMouseDown,
    onKeyDown,
    className,
    selectRef,
}: SelectProps<T>): React.ReactElement {
    return (
        <div className={clsx("input-group", className)}>
            <label>
                {label}
                <select ref={selectRef}
                        className="input-select"
                        disabled={disabled || isLoading}
                        name={name}
                        value={isLoading ? "_loading" : value ?? "_placeholder"}
                        onChange={onChange}
                        onMouseDown={onMouseDown}
                        onKeyDown={onKeyDown}
                >
                    <option disabled hidden value="_placeholder">{placeholderLabel}</option>
                    {isLoading
                        ? (
                            <option value="_loading">{loadingOptionLabel}</option>
                        )
                        : (
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
