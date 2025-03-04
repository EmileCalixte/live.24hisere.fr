import React from "react";
import { DropdownMenu as Primitive } from "radix-ui";

export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ children, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Content {...props} ref={ref}>
      {children}
      <Primitive.Arrow />
    </Primitive.Content>
  </Primitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuLabel = Primitive.Label;
export const DropdownMenuItem = Primitive.Item;
export const DropdownMenuGroup = Primitive.Group;
export const DropdownMenuSeparator = Primitive.Separator;
