import { twMerge } from "tailwind-merge";
import type { PolymorphicProps } from "../../types/utils/react";

type CardProps<TElement extends React.ElementType> = PolymorphicProps<TElement> & {
  className?: string | undefined;
};

export function Card<TElement extends React.ElementType = "div">({
  as,
  children,
  className,
  ...props
}: CardProps<TElement>): React.ReactElement {
  const Component = as ?? "div";

  return (
    <Component
      className={twMerge(
        "border border-neutral-300 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
