import React from "react";
import { Separator as Primitive } from "radix-ui";
import { twMerge } from "tailwind-merge";

export const Separator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Primitive.Root>>(
  ({ children, className, ...props }, ref) => (
    <Primitive.Root
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
    </Primitive.Root>
  ),
);
Separator.displayName = "Separator";
