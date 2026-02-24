import type React from "react";
import { cn } from "tailwind-variants";
import { BUTTON_CLASSNAMES, BUTTON_COLOR_TO_CLASSNAMES, BUTTON_SIZE_TO_CLASSNAMES } from "../../../constants/ui/button";
import { LINK_CLASSAMES } from "../../../constants/ui/link";
import type { ButtonColor, ButtonSize } from "../../../types/ui/button";
import CircularLoader from "../CircularLoader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "button" | "link";
  color?: ButtonColor;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = "button",
  color = "green",
  size = "base",
  className,
  isLoading,
  disabled,
  icon,
  children,
  onClick,
  ...props
}: ButtonProps): React.ReactElement {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isLoading) {
      e.preventDefault();
      return;
    }

    onClick?.(e);
  };

  return (
    <button
      className={
        variant === "link"
          ? cn(LINK_CLASSAMES, className)
          : cn(
              !disabled && BUTTON_COLOR_TO_CLASSNAMES[color],
              BUTTON_SIZE_TO_CLASSNAMES[size],
              BUTTON_CLASSNAMES,
              !disabled && "[&:not(.loading)]:cursor-pointer",
              disabled && "bg-neutral-400 text-neutral-600 dark:bg-neutral-500 dark:text-neutral-800",
              className,
              isLoading && "loading",
            )
      }
      disabled={disabled}
      {...props}
      onClick={handleClick}
      aria-busy={isLoading}
    >
      <span className={cn("flex items-center gap-2", isLoading && "opacity-0")}>
        {icon}
        {children}
      </span>

      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <CircularLoader />
        </span>
      )}
    </button>
  );
}
