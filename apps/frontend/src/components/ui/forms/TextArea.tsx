import type React from "react";
import { twMerge } from "tailwind-merge";
import { COMMON_INPUT_CLASSNAME } from "../../../constants/ui/input";

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
    <label className="flex flex-col">
      <span className={labelClassName}>{label}</span>
      <textarea {...props} className={twMerge(COMMON_INPUT_CLASSNAME, "h-[5em]")} style={{ ...props.style, resize }} />
    </label>
  );
}
