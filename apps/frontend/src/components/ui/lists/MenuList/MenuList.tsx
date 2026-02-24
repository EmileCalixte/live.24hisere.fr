import React from "react";
import { cn } from "tailwind-variants";

export const MenuList = React.forwardRef<HTMLUListElement, React.ComponentPropsWithoutRef<"ul">>(
  ({ children, className, ...props }, ref) => (
    <ul className={cn("inline-flex flex-col gap-2", className)} ref={ref} {...props}>
      {children}
    </ul>
  ),
);
MenuList.displayName = "MenuList";
