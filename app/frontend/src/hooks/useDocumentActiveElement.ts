import { useEffect, useState } from "react";

const FOCUS_OUT_TIMEOUT = 5;

export function useDocumentActiveElement(): Element | null {
    const [activeElement, setActiveElement] = useState(document.activeElement);

    useEffect(() => {
        let focusOutTimeout: NodeJS.Timeout;

        function onFocusIn(): void {
            clearTimeout(focusOutTimeout);

            setActiveElement(document.activeElement);
        }

        function onFocusOut(): void {
            // When clicking on another element or using Tab, the focus out event
            // is always triggered before the focus in event, so we use a short timeout
            // to avoid updating activeElement twice in those cases
            focusOutTimeout = setTimeout(() => {
                setActiveElement(document.activeElement);
            }, FOCUS_OUT_TIMEOUT);
        }

        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);

        return () => {
            document.removeEventListener("focusin", onFocusIn);
            document.removeEventListener("focusout", onFocusOut);
        };
    }, []);

    return activeElement;
}
