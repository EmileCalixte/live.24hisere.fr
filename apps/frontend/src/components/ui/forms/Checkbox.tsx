import type React from "react";

interface CheckboxProps {
  label: string | React.ReactElement;
  checked: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox({ label, checked, name, onChange }: CheckboxProps): React.ReactElement {
  return (
    <label className="flex gap-1">
      <input
        type="checkbox"
        className="accent-app-green-600 dark:accent-app-green-500"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}
