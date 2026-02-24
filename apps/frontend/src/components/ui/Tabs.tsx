import React from "react";
import { Tabs as Primitive } from "@base-ui/react";
import { cn } from "tailwind-variants";

export const Tabs = Primitive.Root;

export const TabList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.List> & { className?: string }
>(({ children, className, ...props }, ref) => (
  <Primitive.List
    className={cn(
      "relative inline-flex flex-wrap gap-1 rounded-md border border-neutral-300 bg-white px-1.25 py-1 dark:border-neutral-700 dark:bg-neutral-800",
      className,
    )}
    {...props}
    ref={ref}
  >
    {children}
    <Primitive.Indicator
      className={cn(
        "rounded-sm bg-active-item",
        "absolute top-px left-0 h-(--active-tab-height) w-(--active-tab-width)",
        "translate-x-(--active-tab-left) translate-y-(--active-tab-top)",
        "transition-all duration-150 ease-out",
      )}
    />
  </Primitive.List>
));
TabList.displayName = "TabList";

export const Tab = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Primitive.Tab> & { className?: string }
>(({ children, className, ...props }, ref) => (
  <Primitive.Tab
    className={cn(
      "z-1 rounded-sm px-2 py-0.5 transition",
      "data-selected:text-app-green-900 dark:data-selected:text-app-green-100",
      "not-data-selected:cursor-pointer not-data-selected:hover:text-app-green-800 dark:not-data-selected:hover:text-app-green-100/80",
      className,
    )}
    {...props}
    ref={ref}
  >
    {children}
  </Primitive.Tab>
));
Tab.displayName = "Tab";

export const TabContent = Primitive.Panel;
