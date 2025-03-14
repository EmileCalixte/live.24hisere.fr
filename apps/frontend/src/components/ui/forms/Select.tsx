import type React from "react";
import { COMMON_INPUT_CLASSNAME } from "../../../constants/ui/input";
import type { SelectOption } from "../../../types/Forms";

export interface SelectProps<TValue extends SelectOption["value"]>
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<SelectOption<TValue>>;
  isLoading?: boolean;
  loadingOptionLabel?: string;
  placeholderLabel?: string;
  value?: TValue | undefined;
  selectRef?: React.Ref<HTMLSelectElement>;
}

export default function Select<TValue extends SelectOption["value"]>({
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
}: SelectProps<TValue>): React.ReactElement {
  return (
    <div className={className}>
      <label className="flex flex-col">
        {label}
        <select
          ref={selectRef}
          className={COMMON_INPUT_CLASSNAME}
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
                <option key={index} value={option.value} disabled={option.disabled}>
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
