import React from "react";
import { Menu as Primitive } from "@base-ui-components/react/menu";
import clsx from "clsx";

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;

export const DropdownMenuPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.Popup>
>(({ children, className, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Positioner className="outline-none" sideOffset={8}>
      <Primitive.Popup
        className={clsx("flex flex-col rounded-sm bg-white shadow-sm dark:bg-neutral-700", className)}
        {...props}
        ref={ref}
      >
        {children}
        <Primitive.Arrow className="fill-white dark:fill-neutral-700" />
      </Primitive.Popup>
    </Primitive.Positioner>
  </Primitive.Portal>
));
DropdownMenuPopup.displayName = "DropdownMenuPopup";

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithRef<typeof Primitive.Item>>(
  ({ children, className, ...props }) => (
    <Primitive.Item
      className={clsx("p-2 hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600", className)}
      {...props}
      render={<button>{children}</button>}
    />
  ),
);
DropdownMenuItem.displayName = "DropdownMenuItem";

// export const DropdownMenuLabel = Primitive.Label;
// export const DropdownMenuGroup = Primitive.Group;
// export const DropdownMenuSeparator = Primitive.Separator;
