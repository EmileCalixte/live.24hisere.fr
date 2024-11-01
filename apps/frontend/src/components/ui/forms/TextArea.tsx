import React from "react";
import clsx from "clsx";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelClassName?: string;
  resize?: "horizontal" | "vertical" | "both" | "none";
}

export function TextArea({
  label,
  className,
  labelClassName,
  resize = "vertical",
  ...props
}: TextAreaProps): React.ReactElement {
  return (
    <div className={clsx("input-group", className)}>
      <label>
        <span className={labelClassName}>{label}</span>
        <textarea {...props} className="textarea" style={{ ...props.style, resize }} />
      </label>
    </div>
  );
}
