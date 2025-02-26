import type React from "react";
import clsx from "clsx";

interface CheckboxProps {
  label: string | React.ReactElement;
  checked: boolean;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function Checkbox({ label, checked, name, onChange, className }: CheckboxProps): React.ReactElement {
  return (
    <div className={clsx("inline-input-group", className)}>
      <label className="input-checkbox">
        <span className="d-flex align-items-center">
          <input type="checkbox" name={name} checked={checked} onChange={onChange} />
          <span />
          <span>{label}</span>
        </span>
      </label>
    </div>
  );
}
