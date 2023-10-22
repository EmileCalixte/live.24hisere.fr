import clsx from "clsx";
import latinize from "latinize";
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
    const { options, value } = props;

    const selectRef = React.useRef<HTMLSelectElement>(null);
    const openedContainerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const optionsListRef = React.useRef<HTMLUListElement>(null);
    const selectedButtonRef = React.useRef<HTMLButtonElement>(null);

    const documentActiveElement = useDocumentActiveElement();

    const [shouldOpenOnSelectFocus, setShouldOpenOnSelectFocus] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const filteredOptions = React.useMemo(() => {
        const simplifiedSearch = latinize(search.trim()).toLowerCase();

        return options.filter(option => {
            const simplifiedLabel = latinize(option.label).toLowerCase();

            return simplifiedLabel.includes(simplifiedSearch);
        });
    }, [options, search]);

    const isOpened = React.useMemo<boolean>(() => {
        return (
            (documentActiveElement === selectRef.current && shouldOpenOnSelectFocus)
            || openedContainerRef.current?.contains(documentActiveElement)
        ) ?? false;
    }, [documentActiveElement, shouldOpenOnSelectFocus]);

    const onSelectMouseDown: React.MouseEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault(); // Prevent the select default menu from opening on click
        selectRef.current?.focus();

        if (isOpened) {
            setShouldOpenOnSelectFocus(false);
        } else {
            setShouldOpenOnSelectFocus(opened => !opened);
        }

        props.onMouseDown?.(e);
    };

    const onSelectBlur: React.FocusEventHandler<HTMLSelectElement> = (e) => {
        // Without setTimeout 0, menu is hidden before search input is focused on search input click / focus with tab key
        setTimeout(() => { setShouldOpenOnSelectFocus(false); }, 0);

        props.onBlur?.(e);
    };

    const onSelectKeyDown: React.KeyboardEventHandler<HTMLSelectElement> = (e) => {
        if (e.key === Key.ESCAPE) {
            closeSelect();
        }

        if (e.key === Key.ENTER) {
            e.preventDefault(); // Prevent the select default menu from opening on pressing Enter
            setShouldOpenOnSelectFocus(opened => !opened);
        }

        props.onKeyDown?.(e);
    };

    const onSearchInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === Key.ESCAPE) {
            closeSelect();
        }
    };

    function closeSelect(): void {
        selectRef.current?.focus();
        setShouldOpenOnSelectFocus(false);
    }

    function selectOption(value: T): void {
        if (!selectRef.current) {
            return;
        }

        selectRef.current.value = value.toString();
        selectRef.current.dispatchEvent(new Event("change", {
            bubbles: true,
            cancelable: true,
        }));

        closeSelect();
    }

    React.useEffect(() => {
        if (!isOpened || !openedContainerRef.current || !optionsListRef.current || !selectedButtonRef.current) {
            return;
        }

        // When options menu is opened or search value is updated, scroll to selected element
        const optionsContainerHeight = openedContainerRef.current.offsetHeight;
        const selectedButtonOffsetTop = selectedButtonRef.current.offsetTop;

        optionsListRef.current.scrollTop = selectedButtonOffsetTop - (optionsContainerHeight / 2);
    }, [isOpened, search]);

    React.useEffect(() => {
        if (!isOpened) {
            return;
        }

        // When options menu is opened, reset search field
        setSearch("");
    }, [isOpened]);

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
                     onMouseDown={(e) => { e.preventDefault(); }} // We don't want the select options to close when the user clicks inside
                     ref={openedContainerRef}
                >
                    {searchable && (
                        <Input label={searchInputLabelAndPlaceHolder ?? "Rechercher"}
                               placeholder={searchInputLabelAndPlaceHolder}
                               value={search}
                               onChange={e => { setSearch(e.target.value); }}
                               onKeyDown={onSearchInputKeyDown}
                               className="mx-2 my-2"
                               labelClassName="hidden-label"
                               autoFocus
                               autoComplete="off"
                               inputRef={searchInputRef}
                        />
                    )}

                    {searchable && options.length && !filteredOptions.length
                        ? (
                            <p className="mx-2 mt-0 mb-2">Aucun résultat</p>
                        )
                        : (
                            <ul className="custom-select-options-list" ref={optionsListRef}>
                                {filteredOptions.map((option, index) => {
                                    const isSelectedOption = value === option.value.toString();

                                    return (
                                        <li key={index}>
                                            <button className={clsx(isSelectedOption && "selected")}
                                                    ref={isSelectedOption ? selectedButtonRef : undefined}
                                                    onMouseDown={() => { selectOption(option.value); }}
                                            >
                                                {option.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                </div>
            )}
        </div>

    );
}
