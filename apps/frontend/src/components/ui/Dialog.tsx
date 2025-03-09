import React from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog as Primitive } from "radix-ui";
import { twMerge } from "tailwind-merge";

export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogTitle = Primitive.Title;

export const DialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Primitive.Content>>(
  ({ children, className, ...props }, ref) => (
    <Primitive.Portal>
      <Primitive.Overlay className="fixed inset-0 bg-black/50" />

      <Primitive.Content
        className={twMerge(
          "fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[640px] -translate-x-1/2 -translate-y-1/2",
          "p-4",
          "bg-white shadow-lg dark:bg-neutral-700",
          className,
        )}
        {...props}
        ref={ref}
      >
        {children}

        <Primitive.Close aria-label="Fermer" asChild>
          <button className="absolute right-3.5 top-3 cursor-pointer">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  ),
);
DialogContent.displayName = "DialogContent";
