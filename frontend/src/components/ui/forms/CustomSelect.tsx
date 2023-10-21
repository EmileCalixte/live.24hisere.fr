import React from "react";
import { Key } from "../../../constants/keyboardEvent";
import { type SelectOption } from "../../../types/Forms";
import Select, { type SelectProps } from "./Select";

interface CustomSelectProps<T extends SelectOption["value"]> extends Omit<SelectProps<T>, "selectRef"> {
    searchable?: boolean;
}

export default function CustomSelect<T extends SelectOption["value"]>({
    searchable = false,
    ...props
}: CustomSelectProps<T>): React.ReactElement {
    const selectRef = React.useRef<HTMLSelectElement>(null);

    const onSelectMouseDown: React.MouseEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault(); // Prevent the select default menu from opening on click
        selectRef.current?.focus();
        props.onMouseDown?.(e);
    };

    const onSelectKeyDown: React.KeyboardEventHandler<HTMLSelectElement> = (e) => {
        if (e.key === Key.ENTER) {
            e.preventDefault(); // Prevent the select default menu from opening on pressing Enter
        }

        props.onKeyDown?.(e);
    };

    return (
        <Select {...props}
                onMouseDown={onSelectMouseDown}
                onKeyDown={onSelectKeyDown}
                selectRef={selectRef}
        />
    );
}
