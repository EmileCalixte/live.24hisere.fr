import type React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import CircularLoader from "../CircularLoader";

type Color = "green" | "orange" | "red" | "gray";
type Size = "base" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "button" | "a";
  color?: Color;
  size?: Size;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const colorToClass: Record<Color, string> = {
  green:
    "text-white dark:text-neutral-200 bg-app-green-600 [&:not(.loading)]:hover:bg-app-green-400 dark:bg-app-green-700 [&:not(.loading)]:dark:hover:bg-app-green-600",
  orange:
    "text-white dark:text-neutral-100/85 bg-orange-400 [&:not(.loading)]:hover:bg-orange-300 dark:bg-orange-700 [&:not(.loading)]:dark:hover:bg-orange-600",
  red: "text-white dark:text-neutral-100/85 bg-red-600 [&:not(.loading)]:hover:bg-red-400 dark:bg-red-800 [&:not(.loading)]:dark:hover:bg-red-700",
  gray: "text-white dark:text-neutral-200 bg-neutral-500 dark:bg-neutral-600 [&:not(.loading)]:hover:bg-neutral-400 [&:not(.loading)]:dark:hover:bg-neutral-500",
};

const sizeToClass: Record<Size, string> = {
  base: "py-1.5 px-3 text-[0.95rem]",
  sm: "py-1 px-2 text-[0.8rem]",
};

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
      className={twMerge(
        !disabled && colorToClass[color],
        sizeToClass[size],
        "relative inline-flex items-center justify-center rounded-sm font-bold transition-colors",
        !disabled && "[&:not(.loading)]:cursor-pointer",
        disabled && "bg-neutral-400 text-neutral-600 dark:bg-neutral-500 dark:text-neutral-800",
        className,
        isLoading && "loading",
      )}
      disabled={disabled}
      {...props}
      onClick={handleClick}
      aria-busy={isLoading}
    >
      <span className={clsx("flex items-center gap-2", isLoading && "opacity-0")}>
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
