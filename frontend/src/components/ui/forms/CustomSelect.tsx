import React from "react";
import { Key } from "../../../constants/keyboardEvent";
import { useDocumentActiveElement } from "../../../hooks/useDocumentActiveElement";
import { type SelectOption } from "../../../types/Forms";
import { Input } from "./Input";
import Select, { type SelectProps } from "./Select";

interface CustomSelectProps<T extends SelectOption["value"]> extends Omit<SelectProps<T>, "selectRef"> {
    searchable?: boolean;
    searchInputLabelAndPlaceHolder?: string;
}

export default function CustomSelect<T extends SelectOption["value"]>({
    searchable = false,
    searchInputLabelAndPlaceHolder,
    ...props
}: CustomSelectProps<T>): React.ReactElement {
    const selectRef = React.useRef<HTMLSelectElement>(null);
    const openedContainerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const documentActiveElement = useDocumentActiveElement();

    const [shouldOpenOnSelectFocus, setShouldOpenOnSelectFocus] = React.useState(false);

    // TODO handle properly touch events on mobile (currently we have to touch twice to open menu after page loading)
    const isOpened = React.useMemo<boolean>(() => {
        return (documentActiveElement === selectRef.current && shouldOpenOnSelectFocus)
            || documentActiveElement === openedContainerRef.current
            || documentActiveElement === searchInputRef.current;
    }, [documentActiveElement, shouldOpenOnSelectFocus]);

    const onSelectMouseDown: React.MouseEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault(); // Prevent the select default menu from opening on click
        selectRef.current?.focus();
        setShouldOpenOnSelectFocus(opened => !opened);

        props.onMouseDown?.(e);
    };

    const onSelectBlur: React.FocusEventHandler<HTMLSelectElement> = (e) => {
        // Without setTimeout 0, menu is hidden before search input is focused on search input click / focus with tab key
        setTimeout(() => { setShouldOpenOnSelectFocus(false); }, 0);

        props.onBlur?.(e);
    };

    const onSelectKeyDown: React.KeyboardEventHandler<HTMLSelectElement> = (e) => {
        if (e.key === Key.ENTER) {
            e.preventDefault(); // Prevent the select default menu from opening on pressing Enter
            setShouldOpenOnSelectFocus(opened => !opened);
        }

        props.onKeyDown?.(e);
    };
    const onOpenedContainerMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        // We don't want the select options to close when the user clicks on the menu background
        if (e.target === openedContainerRef.current) {
            e.preventDefault();
        }
    };

    return (
        <div className="custom-select-container">
            <Select {...props}
                    onMouseDown={onSelectMouseDown}
                    onKeyDown={onSelectKeyDown}
                    onBlur={onSelectBlur}
                    selectRef={selectRef}
            />
            {isOpened && (
                <div className="custom-select-opened-container"
                     onMouseDown={onOpenedContainerMouseDown}
                     ref={openedContainerRef}
                >
                    {searchable && (
                        <Input label={searchInputLabelAndPlaceHolder ?? "Rechercher"}
                               placeholder={searchInputLabelAndPlaceHolder}
                               className="mx-2 my-2"
                               labelClassName="hidden-label"
                               autoFocus
                               autoComplete="off"
                               inputRef={searchInputRef}
                        />
                    )}
                    Options
                </div>
            )}
        </div>

    );
}
