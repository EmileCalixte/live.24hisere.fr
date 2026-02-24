import type React from "react";
import { cn } from "tailwind-variants";
import type { SelectOption } from "../../../types/Forms";

interface RadioGroupProps<T extends SelectOption["value"]> {
  legend: string;
  name: string;
  options: Array<SelectOption<T>>;
  value: SelectOption["value"];
  onSelectOption?: (option: SelectOption<T>) => void;
  className?: string;
}

export default function RadioGroup<T extends SelectOption["value"]>({
  legend,
  name,
  options,
  value,
  onSelectOption,
  className,
}: RadioGroupProps<T>): React.ReactElement {
  return (
    <fieldset className={cn("", className)}>
      <legend>{legend}</legend>
      {options.map((option) => (
        <div className="flex" key={option.value}>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              className="accent-app-green-600 dark:accent-app-green-500"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={
                onSelectOption
                  ? () => {
                      onSelectOption(option);
                    }
                  : undefined
              }
            />
            {option.label}
          </label>
        </div>
      ))}
    </fieldset>
  );
}
