import type React from "react";
// eslint-disable-next-line no-restricted-imports -- This is the only place where we import Link from react-router-dom
import { Link as ReactRouterLink, type To } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { BUTTON_CLASSNAMES, BUTTON_COLOR_TO_CLASSNAMES, BUTTON_SIZE_TO_CLASSNAMES } from "../../constants/ui/button";
import { LINK_CLASSAMES } from "../../constants/ui/link";
import type { ButtonColor, ButtonSize } from "../../types/ui/button";

export type LinkProps = Omit<React.ComponentProps<typeof ReactRouterLink>, "to"> & {
  to?: To | undefined;

  variant?: "link" | "button";

  /**
   * The button color if `variant === "button"`
   */
  color?: ButtonColor;

  /**
   * The button size if `variant === "button"`
   */
  size?: ButtonSize;

  icon?: React.ReactNode;
};

export const Link = ({
  to,
  variant = "link",
  color = "green",
  size = "base",
  icon,
  className,
  children,
  ...props
}: LinkProps): React.ReactElement => {
  if (!to) {
    return <>{children}</>;
  }

  return (
    <ReactRouterLink
      to={to}
      className={
        variant === "link"
          ? twMerge(LINK_CLASSAMES, className)
          : twMerge(BUTTON_COLOR_TO_CLASSNAMES[color], BUTTON_SIZE_TO_CLASSNAMES[size], BUTTON_CLASSNAMES, className)
      }
      rel={props.target === "_blank" ? "noreferrer" : undefined}
      {...props}
    >
      {icon ? (
        <span className="flex items-center gap-2">
          {icon}
          {children}
        </span>
      ) : (
        children
      )}
    </ReactRouterLink>
  );
};
