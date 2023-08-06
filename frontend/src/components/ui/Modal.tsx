import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

interface ModalProps {
    children: React.ReactNode | React.ReactNode[];
    close: () => any;
    className?: string;
}

export default function Modal({ children, close, className }: ModalProps): JSX.Element {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const modalContentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ref = dialogRef;

        if (ref.current?.open) {
            return;
        }

        ref.current?.showModal();

        // Call props close function on click outside modal
        function onClick(e: MouseEvent): void {
            if (e.target === null || !(e.target instanceof Element)) {
                return;
            }

            let target: Element | ParentNode | null = e.target;

            do {
                if (target === modalContentRef.current) {
                    return;
                }

                target = target.parentNode;
            } while (target);

            close();
        }

        // The 'close' event is triggered when HTML dialog is closed via .close() method or Esc key
        // If user closes modal using "esc", we want to call the close function in props, which should unmount this component
        function onClose(): void {
            close();
        }

        ref.current?.addEventListener("close", onClose);

        setTimeout(() => {
            window.addEventListener("click", onClick);
        }, 0);

        return () => {
            window.removeEventListener("click", onClick);
            ref.current?.removeEventListener("close", onClose);
        };
    }, [close, dialogRef, modalContentRef]);

    return (
        <dialog ref={dialogRef} className={clsx("modal", className)}>
            <div ref={modalContentRef} className="modal-content">
                <button className="close-button" onClick={() => close()}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                {children}
            </div>
        </dialog>
    );
}
