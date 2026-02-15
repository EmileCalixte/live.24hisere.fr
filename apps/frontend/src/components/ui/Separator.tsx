import React from "react";
import { Separator as Primitive } from "@base-ui/react/separator";
import { twMerge } from "tailwind-merge";

export const Separator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive> & { className?: string }
>(({ children, className, ...props }, ref) => (
  <Primitive
    className={twMerge(
      "bg-black/15 dark:bg-white/15",
      "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
      "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
      className,
    )}
    {...props}
    ref={ref}
  >
    {children}
  </Primitive>
));
Separator.displayName = "Separator";
