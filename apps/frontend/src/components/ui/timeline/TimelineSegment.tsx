import type React from "react";
import { cn } from "tailwind-variants";

interface TimelineSegmentProps {
  children: React.ReactNode[] | React.ReactNode;
  hideBorder?: true;
}

export function TimelineSegment({ children, hideBorder }: TimelineSegmentProps): React.ReactElement {
  return (
    <div className="flex gap-2">
      <div className={cn("-my-0.5 flex w-5 flex-none justify-center", hideBorder && "invisible")}>
        <div className="w-0.5 bg-neutral-200 dark:bg-neutral-700" />
      </div>
      <div>{children}</div>
    </div>
  );
}
