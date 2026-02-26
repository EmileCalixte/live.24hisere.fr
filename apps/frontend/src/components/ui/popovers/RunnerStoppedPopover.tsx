import type React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";

type RunnerStoppedPopoverProps = Pick<React.ComponentProps<typeof PopoverTrigger>, "children">;

export default function RunnerStoppedPopover({ children }: RunnerStoppedPopoverProps): React.ReactElement {
  return (
    <Popover>
      <PopoverTrigger openOnHover={true} delay={0}>
        {children}
      </PopoverTrigger>
      <PopoverContent>
        Ce coureur a annoncé s'être arrêté. Il sera quand même classé à la fin de la course.
      </PopoverContent>
    </Popover>
  );
}
