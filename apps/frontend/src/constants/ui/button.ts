import type { ButtonColor, ButtonSize } from "../../types/ui/button";

export const BUTTON_CLASSNAMES =
  "relative inline-flex items-center justify-center rounded-sm font-bold transition-colors";

export const BUTTON_COLOR_TO_CLASSNAMES: Record<ButtonColor, string> = {
  green:
    "text-white dark:text-neutral-200 bg-app-green-600 [&:not(.loading)]:hover:bg-app-green-400 dark:bg-app-green-700 [&:not(.loading)]:dark:hover:bg-app-green-600",
  orange:
    "text-white dark:text-neutral-100/85 bg-orange-400 [&:not(.loading)]:hover:bg-orange-300 dark:bg-orange-700 [&:not(.loading)]:dark:hover:bg-orange-600",
  red: "text-white dark:text-neutral-100/85 bg-red-600 [&:not(.loading)]:hover:bg-red-400 dark:bg-red-800 [&:not(.loading)]:dark:hover:bg-red-700",
  gray: "text-white dark:text-neutral-200 bg-neutral-500 dark:bg-neutral-600 [&:not(.loading)]:hover:bg-neutral-400 [&:not(.loading)]:dark:hover:bg-neutral-500",
};

export const BUTTON_SIZE_TO_CLASSNAMES: Record<ButtonSize, string> = {
  base: "py-1.5 px-3 text-[0.95rem]",
  sm: "py-1 px-2 text-[0.8rem]",
};
