import React from "react";
import { Key } from "../../../constants/keyboardEvent";
import { Input } from "./Input";

type DebouncedInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  onChange?: (value: string) => void;
  debounceTimeout?: number;
};

export function DebouncedInput({
  onChange,
  onBlur,
  onKeyDown,
  debounceTimeout = 1000,
  ...props
}: DebouncedInputProps): React.ReactElement {
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingValueRef = React.useRef<string | null>(null);

  // Always keep a ref to the latest onChange to avoid stale closures in the timeout
  const onChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  React.useEffect(
    () => () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  function flush(): void {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (pendingValueRef.current !== null) {
      onChangeRef.current?.(pendingValueRef.current);
      pendingValueRef.current = null;
    }
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    pendingValueRef.current = e.target.value;

    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(flush, debounceTimeout);
  };

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    flush();
    onBlur?.(e);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === Key.ENTER) {
      flush();
    }

    onKeyDown?.(e);
  };

  return <Input onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} {...props} />;
}
