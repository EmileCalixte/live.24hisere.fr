import type React from "react";
import { Tooltip as MuiTooltip } from "@mui/material";

type MuiTooltipProps = React.ComponentProps<typeof MuiTooltip>;

interface AsProp<E extends React.ElementType> {
  as?: E;
}

type TooltipProps<E extends React.ElementType> = Omit<MuiTooltipProps, "arrow" | "children">
  & AsProp<E> & {
    children: MuiTooltipProps["children"] | string;
  };

export function Tooltip<E extends React.ElementType>({
  as,
  children,
  placement = "top",
  ...props
}: TooltipProps<E>): React.ReactElement {
  const Component = as ?? "span";

  return (
    <MuiTooltip placement={placement} enterDelay={0} enterTouchDelay={0} leaveTouchDelay={5000} arrow {...props}>
      <Component onClick={(e) => false}>{children}</Component>
    </MuiTooltip>
  );
}
