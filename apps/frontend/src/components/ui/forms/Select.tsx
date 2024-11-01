import React from "react";
import clsx from "clsx";
import { type SelectOption } from "../../../types/Forms";

export interface SelectProps<T extends SelectOption["value"]> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<SelectOption<T>>;
  isLoading?: boolean;
  loadingOptionLabel?: string;
  placeholderLabel?: string;
  value?: SelectOption["value"] | undefined;
  selectRef?: React.LegacyRef<HTMLSelectElement>;
}

export default function Select<T extends SelectOption["value"]>({
  label,
  options,
  disabled = false,
  isLoading = false,
  loadingOptionLabel = "Chargement",
  placeholderLabel = "",
  value,
  className,
  selectRef,
  ...props
}: SelectProps<T>): React.ReactElement {
  return (
    <div className={clsx("input-group", className)}>
      <label>
        {label}
        <select
          ref={selectRef}
          className="input-select"
          disabled={disabled || isLoading}
          value={isLoading ? "_loading" : (value ?? "_placeholder")}
          {...props}
        >
          <option disabled hidden value="_placeholder">
            {placeholderLabel}
          </option>
          {isLoading ? (
            <option value="_loading">{loadingOptionLabel}</option>
          ) : (
            <>
              {options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
      </label>
    </div>
  );
}
