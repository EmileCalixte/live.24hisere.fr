import React from "react";
import clsx from "clsx";
import { DropdownMenu as Primitive } from "radix-ui";

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ children, className, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Content
      className={clsx("flex flex-col rounded-sm bg-white shadow-sm dark:bg-neutral-700", className)}
      {...props}
      ref={ref}
    >
      {children}
      <Primitive.Arrow className="fill-white dark:fill-neutral-700" />
    </Primitive.Content>
  </Primitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Primitive.Item>
>(({ children, className, ...props }, ref) => (
  <Primitive.Item
    className={clsx("p-2 hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600", className)}
    asChild
    {...props}
  >
    <button ref={ref}>{children}</button>
  </Primitive.Item>
));
DropdownMenuItem.displayName = "DropdownMenuItem";

// export const DropdownMenuLabel = Primitive.Label;
// export const DropdownMenuGroup = Primitive.Group;
// export const DropdownMenuSeparator = Primitive.Separator;
