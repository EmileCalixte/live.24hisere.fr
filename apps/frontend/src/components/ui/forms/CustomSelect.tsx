import React from "react";
import clsx from "clsx";
import latinize from "latinize";
import { Key } from "../../../constants/keyboardEvent";
import { useDocumentActiveElement } from "../../../hooks/useDocumentActiveElement";
import { type SelectOption } from "../../../types/Forms";
import { Input } from "./Input";
import Select, { type SelectProps } from "./Select";

interface CustomSelectProps<T extends SelectOption["value"]> extends Omit<SelectProps<T>, "selectRef"> {
  searchable?: boolean;
  searchInputLabelAndPlaceHolder?: string;
}

/**
 * TODO fix iOS
 */
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

    return options.filter((option) => {
      const simplifiedLabel = latinize(option.label).toLowerCase();

      return simplifiedLabel.includes(simplifiedSearch);
    });
  }, [options, search]);

  const isOpened = React.useMemo<boolean>(() => {
    return (
      ((documentActiveElement === selectRef.current && shouldOpenOnSelectFocus) ||
        openedContainerRef.current?.contains(documentActiveElement)) ??
      false
    );
  }, [documentActiveElement, shouldOpenOnSelectFocus]);

  const onSelectMouseDown: React.MouseEventHandler<HTMLSelectElement> = (e) => {
    e.preventDefault(); // Prevent the select default menu from opening on click
    selectRef.current?.focus();

    if (isOpened) {
      setShouldOpenOnSelectFocus(false);
    } else {
      setShouldOpenOnSelectFocus((opened) => !opened);
    }

    props.onMouseDown?.(e);
  };

  const onSelectBlur: React.FocusEventHandler<HTMLSelectElement> = (e) => {
    // Without setTimeout 0, menu is hidden before search input is focused on search input click / focus with tab key
    setTimeout(() => {
      setShouldOpenOnSelectFocus(false);
    }, 0);

    props.onBlur?.(e);
  };

  const onSelectKeyDown: React.KeyboardEventHandler<HTMLSelectElement> = (e) => {
    if (e.key === Key.ESCAPE) {
      closeSelect();
    }

    if ([Key.ENTER, Key.SPACE].includes(e.key as Key)) {
      e.preventDefault(); // Prevent the select default menu from opening on pressing Enter
      setShouldOpenOnSelectFocus((opened) => !opened);
    }

    props.onKeyDown?.(e);
  };

  const onSearchInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    switch (e.key) {
      case Key.ESCAPE:
        closeSelect();
        break;
      case Key.ENTER:
        e.preventDefault(); // For some reason, if we don't prevent the default event, the default select options will appear after the custom menu is closed
        updateSelectedOptionFromKeyboardEnter();
        break;
      case Key.ARROW_UP:
      case Key.ARROW_DOWN:
        updateSelectedOptionFromKeyboardArrow(e.key);
        break;
    }
  };

  function updateSelectedOptionFromKeyboardEnter(): void {
    if (!filteredOptions.length) {
      return;
    }

    if (!value) {
      selectOption(filteredOptions[0].value);
      return;
    }

    const valueIndex = filteredOptions.findIndex((option) => option.value.toString() === value.toString());

    if (valueIndex !== -1) {
      // The currently selected option is visible in filtered options, so we keep this one and just close the select menu
      closeSelect();
      return;
    }

    // The currently selected option is not visible in filtered options, so we select the first one and close the select menu
    selectOption(filteredOptions[0].value);
  }

  function updateSelectedOptionFromKeyboardArrow(key: Key.ARROW_UP | Key.ARROW_DOWN): void {
    if (!filteredOptions.length) {
      return;
    }

    if (!value) {
      if (key === Key.ARROW_UP) {
        return;
      }

      selectOption(filteredOptions[0].value, false);
      return;
    }

    const valueIndex = filteredOptions.findIndex((option) => option.value.toString() === value.toString());

    if (
      (valueIndex === 0 && key === Key.ARROW_UP) ||
      (valueIndex === filteredOptions.length - 1 && key === Key.ARROW_DOWN)
    ) {
      return;
    }

    selectOption(filteredOptions[valueIndex + (key === Key.ARROW_UP ? -1 : +1)].value, false);
  }

  function closeSelect(): void {
    selectRef.current?.focus();
    setShouldOpenOnSelectFocus(false);
  }

  function selectOption(value: T, closeSelectOptions = true): void {
    if (!selectRef.current) {
      return;
    }

    selectRef.current.value = value.toString();
    selectRef.current.dispatchEvent(
      new Event("change", {
        bubbles: true,
        cancelable: true,
      }),
    );

    closeSelectOptions && closeSelect();
  }

  React.useEffect(() => {
    if (!isOpened || !openedContainerRef.current || !optionsListRef.current || !selectedButtonRef.current) {
      return;
    }

    // When options menu is opened or search value is updated, scroll to selected element
    const optionsContainerHeight = openedContainerRef.current.offsetHeight;
    const selectedButtonOffsetTop = selectedButtonRef.current.offsetTop;

    optionsListRef.current.scrollTop = selectedButtonOffsetTop - optionsContainerHeight / 2;
  }, [isOpened, search, value]);

  React.useEffect(() => {
    if (!isOpened) {
      return;
    }

    // When options menu is opened, reset search field
    setSearch("");
  }, [isOpened]);

  return (
    <div className="custom-select-container">
      <Select
        {...props}
        onMouseDown={onSelectMouseDown}
        onKeyDown={onSelectKeyDown}
        onBlur={onSelectBlur}
        selectRef={selectRef}
      />
      {isOpened && (
        <div
          className="custom-select-opened-container"
          onMouseDown={(e) => {
            e.preventDefault();
          }} // We don't want the select options to close when the user clicks inside
          ref={openedContainerRef}
        >
          {searchable && (
            <Input
              label={searchInputLabelAndPlaceHolder ?? "Rechercher"}
              placeholder={searchInputLabelAndPlaceHolder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={onSearchInputKeyDown}
              className="mx-2 my-2"
              labelClassName="hidden-label"
              autoFocus
              autoComplete="off"
              inputRef={searchInputRef}
            />
          )}

          {searchable && options.length && !filteredOptions.length ? (
            <p className="mx-2 mt-0 mb-2">
              {/* Easter egg */}
              {search === "SALUT DJESON" ? "Salut" : "Aucun résultat"}
            </p>
          ) : (
            <ul className="custom-select-options-list" ref={optionsListRef}>
              {filteredOptions.map((option, index) => {
                const isSelectedOption = value === option.value.toString();

                return (
                  <li key={index}>
                    <button
                      className={clsx(isSelectedOption && "selected")}
                      ref={isSelectedOption ? selectedButtonRef : undefined}
                      onMouseDown={() => {
                        selectOption(option.value);
                      }}
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
