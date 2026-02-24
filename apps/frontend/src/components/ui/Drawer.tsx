import React from "react";
import { DrawerPreview as Primitive } from "@base-ui/react/drawer";
import { cn } from "tailwind-variants";

export type DrawerOpenDirection = "left" | "right" | "up" | "down";

export const DrawerProvider = Primitive.Root;
export const Drawer = Primitive.Root;
export const DrawerTrigger = Primitive.Trigger;
export const DrawerClose = Primitive.Close;

export const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof Primitive.Popup>,
  React.ComponentPropsWithoutRef<typeof Primitive.Popup> & { openDirection?: DrawerOpenDirection; size?: string }
>(({ children, openDirection = "left", size = "24rem", style, ...props }, ref) => {
  const isHorizontal = openDirection === "left" || openDirection === "right";
  const sizeStyle: React.CSSProperties = isHorizontal ? { width: size } : { height: size };

  return (
    <Primitive.Portal>
      <Primitive.Backdrop className="fixed inset-0 z-10 min-h-dvh bg-black/50 opacity-[calc(1-var(--drawer-swipe-progress))] transition-opacity duration-250 ease-out data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute dark:bg-black/75" />
      <Primitive.Viewport
        className={cn(
          "fixed inset-0 z-10 flex items-stretch p-0",
          openDirection === "right" && "justify-end",
          openDirection === "left" && "justify-start",
          openDirection === "down" && "flex-col justify-end",
          openDirection === "up" && "flex-col justify-start",
        )}
      >
        <Primitive.Popup
          className={cn(
            "touch-auto overflow-y-auto overscroll-contain bg-white transition-transform duration-250 ease-out [--bleed:3rem] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*250ms)] data-swiping:select-none dark:bg-neutral-800",
            isHorizontal
              && "h-full max-w-[calc(100vw-3rem+3rem)] transform-[translateX(var(--drawer-swipe-movement-x))]",
            openDirection === "right"
              && "-mr-12 pr-12 data-ending-style:transform-[translateX(calc(100%-var(--bleed)))] data-starting-style:transform-[translateX(calc(100%-var(--bleed)))]",
            openDirection === "left"
              && "-ml-12 pl-12 data-ending-style:transform-[translateX(calc(-100%+var(--bleed)))] data-starting-style:transform-[translateX(calc(-100%+var(--bleed)))]",
            !isHorizontal
              && "max-h-[calc(100dvh-3rem+3rem)] w-full transform-[translateY(var(--drawer-swipe-movement-y))]",
            openDirection === "down"
              && "-mb-12 pb-12 data-ending-style:transform-[translateY(calc(100%-var(--bleed)))] data-starting-style:transform-[translateY(calc(100%-var(--bleed)))]",
            openDirection === "up"
              && "-mt-12 pt-12 data-ending-style:transform-[translateY(calc(-100%+var(--bleed)))] data-starting-style:transform-[translateY(calc(-100%+var(--bleed)))]",
          )}
          style={{ ...sizeStyle, ...(style ?? {}) }}
          ref={ref}
          {...props}
        >
          <Primitive.Content>{children}</Primitive.Content>
        </Primitive.Popup>
      </Primitive.Viewport>
    </Primitive.Portal>
  );
});
DrawerContent.displayName = "DrawerContent";
