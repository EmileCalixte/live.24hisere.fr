import React from "react";
import { Tooltip as Primitive } from "@base-ui/react/tooltip";
import { cn } from "tailwind-variants";

const CONTENT_STYLE_CLASSNAME =
  "border-1 rounded-sm border-neutral-200 bg-white/95 px-2 py-1 shadow-md dark:border-neutral-600 dark:bg-neutral-700/95 max-w-[min(90vw,500px)]";
const CONTENT_ANIMATION_CLASSNAME =
  "will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade";

export const TooltipProvider = Primitive.Provider;
export const Tooltip = Primitive.Root;
export const TooltipTrigger = Primitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof Primitive.Popup>,
  React.ComponentPropsWithoutRef<typeof Primitive.Popup>
>(({ children, style, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Positioner sideOffset={5} side="top">
      <Primitive.Popup {...props} className={cn(CONTENT_STYLE_CLASSNAME, CONTENT_ANIMATION_CLASSNAME)} ref={ref}>
        {children}
        <Primitive.Arrow
          className={cn(
            "data-[side=bottom]:-top-2",
            "data-[side=left]:-right-3.25 data-[side=left]:rotate-90",
            "data-[side=right]:-left-3.25 data-[side=right]:-rotate-90",
            "data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
          )}
        >
          <ArrowSvg />
        </Primitive.Arrow>
      </Primitive.Popup>
    </Primitive.Positioner>
  </Primitive.Portal>
));
TooltipContent.displayName = "TooltipContent";

function ArrowSvg(props: React.ComponentProps<"svg">): React.ReactElement {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-white dark:fill-neutral-700"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-white dark:fill-neutral-700"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="fill-white dark:fill-neutral-700"
      />
    </svg>
  );
}
