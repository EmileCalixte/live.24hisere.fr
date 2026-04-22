import type React from "react";

interface TimelineDotProps {
  children: React.ReactNode[] | React.ReactNode;
}

export function TimelineDot({ children }: TimelineDotProps): React.ReactElement {
  return (
    <div className="flex items-start gap-2">
      <div className="relative top-1.5 flex w-5 flex-none justify-center">
        <div className="h-3 w-3 rounded-full bg-neutral-400 dark:bg-neutral-500" />
      </div>
      <div>{children}</div>
    </div>
  );
}
