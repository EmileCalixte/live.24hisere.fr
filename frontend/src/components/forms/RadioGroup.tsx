import {type SelectOption} from "../../types/Forms";

interface RadioGroupProps<T extends SelectOption["value"]> {
    legend: string;
    name?: string;
    options: SelectOption<T>[];
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
}: RadioGroupProps<T>) {
    return (
        <fieldset className={className}>
            <legend>{legend}</legend>
            {options.map((option, index) => (
                <div className="inline-input-group" key={index}>
                    <label className="input-radio">
                        <input type="radio"
                               name={name}
                               value={option.value}
                               checked={value === option.value}
                               onChange={onSelectOption ? () => onSelectOption(option) : undefined}
                        />
                        <span />
                        {option.label}
                    </label>
                </div>
            ))}
        </fieldset>
    );
}
