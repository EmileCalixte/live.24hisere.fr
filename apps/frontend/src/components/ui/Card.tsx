import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";
import type { PolymorphicProps } from "../../types/utils/react";

const card = tv({
  base: "border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-800",
  variants: {
    shape: {
      rounded: "rounded-md",
      square: "",
    },
    padding: {
      yes: "p-3 lg:px-6 lg:py-4",
      no: "p-0",
    },
    border: {
      all: "border",
      "right-only": "border-r",
      "bottom-only": "border-b",
    },
  },
  defaultVariants: {
    shape: "rounded",
    padding: "yes",
    border: "all",
  },
});

type CardProps<TElement extends React.ElementType> = PolymorphicProps<TElement>
  & VariantProps<typeof card> & {
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
    <Component className={twMerge(card(props), className)} {...props}>
      {children}
    </Component>
  );
}
