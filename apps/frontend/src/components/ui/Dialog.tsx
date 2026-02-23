import React from "react";
import { Dialog as Primitive } from "@base-ui/react/dialog";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";

export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogTitle = Primitive.Title;

export const DialogPopup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Primitive.Popup> & { className?: string }
>(({ children, className, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Backdrop className="fixed inset-0 bg-black/50" />

    <Primitive.Popup
      className={twMerge(
        "fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-160 -translate-x-1/2 -translate-y-1/2",
        "p-4",
        "bg-white shadow-lg dark:bg-neutral-700",
        className,
      )}
      {...props}
      ref={ref}
    >
      {children}

      <Primitive.Close aria-label="Fermer" className="absolute top-3 right-3.5 cursor-pointer">
        <FontAwesomeIcon icon={faXmark} />
      </Primitive.Close>
    </Primitive.Popup>
  </Primitive.Portal>
));
DialogPopup.displayName = "DialogPopup";
