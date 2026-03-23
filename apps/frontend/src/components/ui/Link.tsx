import type React from "react";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-restricted-imports -- This is the only place where we import Link from react-router-dom
import { Link as ReactRouterLink, type To } from "react-router-dom";
import { cn } from "tailwind-variants";
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

  showExternalIcon?: boolean;
};

export const Link = ({
  to,
  variant = "link",
  color = "green",
  size = "base",
  icon,
  showExternalIcon = false,
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
          ? cn(LINK_CLASSAMES, className)
          : cn(BUTTON_COLOR_TO_CLASSNAMES[color], BUTTON_SIZE_TO_CLASSNAMES[size], BUTTON_CLASSNAMES, className)
      }
      rel={props.target === "_blank" ? "noreferrer" : undefined}
      {...props}
    >
      {!!icon || showExternalIcon ? (
        <span className="inline-flex items-center gap-2 underline">
          {icon}
          {children}
          {showExternalIcon && <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />}
        </span>
      ) : (
        children
      )}
    </ReactRouterLink>
  );
};
