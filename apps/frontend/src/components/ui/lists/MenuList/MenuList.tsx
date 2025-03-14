import React from "react";
import clsx from "clsx";

export const MenuList = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  ({ children, className, ...props }, ref) => (
    <ul className={clsx("inline-flex flex-col gap-2", className)} ref={ref} {...props}>
      {children}
    </ul>
  ),
);
MenuList.displayName = "MenuList";
