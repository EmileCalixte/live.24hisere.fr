import clsx from "clsx";

export function Card({ children, className, ...props }: React.HTMLProps<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={clsx(
        "border border-neutral-300 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
        className,
        { ...props },
      )}
    >
      {children}
    </div>
  );
}
