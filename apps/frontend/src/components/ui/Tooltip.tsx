import React from "react";
import { Tooltip as Primitive } from "radix-ui";
import { twMerge } from "tailwind-merge";

const CONTENT_STYLE_CLASSNAME =
  "border-1 rounded-sm border-neutral-200 bg-white/95 px-2 py-1 shadow-md dark:border-neutral-600 dark:bg-neutral-700/95 max-w-[min(90vw,500px)]";
const CONTENT_ANIMATION_CLASSNAME =
  "will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade";

export const TooltipProvider = Primitive.Provider;
export const Tooltip = Primitive.Root;
export const TooltipTrigger = Primitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ children, style, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Content
      {...props}
      className={twMerge(CONTENT_STYLE_CLASSNAME, CONTENT_ANIMATION_CLASSNAME)}
      sideOffset={5}
      ref={ref}
    >
      {children}
      <Primitive.Arrow height={8} width={12} className="fill-white dark:fill-neutral-700" />
    </Primitive.Content>
  </Primitive.Portal>
));
TooltipContent.displayName = "TooltipContent";
