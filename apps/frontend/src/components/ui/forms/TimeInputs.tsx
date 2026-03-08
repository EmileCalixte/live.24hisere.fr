import React from "react";
import { cn } from "tailwind-variants";
import { Input } from "./Input";

const LABEL_CLASSNAME = "flex items-center gap-0.5";
const INPUT_CLASSNAME = "w-[6ch] text-center";

interface TimeInputsProps {
  legend?: string;
  className?: string;

  /**
   * The time, in ms
   */
  time: number;

  /**
   * Minimum time, in ms
   */
  minTime?: number;

  /**
   * Maximum time, in ms
   */
  maxTime?: number;

  /**
   * @param time The new time, in ms
   */
  setTime: (time: number) => void;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function TimeInputs({
  legend,
  className,
  time,
  minTime = 0,
  maxTime,
  setTime,
}: TimeInputsProps): React.ReactElement {
  if (minTime < 0) {
    throw new Error("minTime cannot be negative");
  }

  const derivedHours = React.useMemo(() => Math.floor(time / 1000 / 3600), [time]);
  const derivedMinutes = React.useMemo(() => Math.floor(time / 1000 / 60) % 60, [time]);
  const derivedSeconds = React.useMemo(() => Math.floor(time / 1000) % 60, [time]);

  // Each field holds its own string during editing so the user can freely
  // clear or type without the value being corrected mid-input.
  const [hoursStr, setHoursStr] = React.useState(() => pad(derivedHours));
  const [minutesStr, setMinutesStr] = React.useState(() => pad(derivedMinutes));
  const [secondsStr, setSecondsStr] = React.useState(() => pad(derivedSeconds));

  // Mirror of string state updated synchronously alongside setState calls.
  // Needed because auto-advancing via focus() triggers blur synchronously,
  // before React has committed the state update — blur handlers read from
  // this ref to avoid capturing stale closure values.
  const valuesRef = React.useRef({ h: pad(derivedHours), m: pad(derivedMinutes), s: pad(derivedSeconds) });

  const setH = React.useCallback((val: string) => {
    valuesRef.current.h = val;
    setHoursStr(val);
  }, []);

  const setM = React.useCallback((val: string) => {
    valuesRef.current.m = val;
    setMinutesStr(val);
  }, []);

  const setS = React.useCallback((val: string) => {
    valuesRef.current.s = val;
    setSecondsStr(val);
  }, []);

  // Sync display when time changes externally (e.g. a linked slider or reset).
  React.useEffect(() => {
    setH(pad(derivedHours));
  }, [derivedHours, setH]);
  React.useEffect(() => {
    setM(pad(derivedMinutes));
  }, [derivedMinutes, setM]);
  React.useEffect(() => {
    setS(pad(derivedSeconds));
  }, [derivedSeconds, setS]);

  const hoursRef = React.useRef<HTMLInputElement>(null);
  const minutesRef = React.useRef<HTMLInputElement>(null);
  const secondsRef = React.useRef<HTMLInputElement>(null);

  const commit = React.useCallback(
    (h: number, m: number, s: number) => {
      // Compute total ms first so that overflow is handled naturally:
      // e.g. 0h 75m 30s → 1h 15m 30s, 0h 0m -1s → clamped to minTime.
      const totalMs = (h * 3600 + m * 60 + s) * 1000;
      const clampedMs = Math.min(Math.max(totalMs, minTime), maxTime ?? Infinity);

      const newH = Math.floor(clampedMs / 1000 / 3600);
      const newM = Math.floor(clampedMs / 1000 / 60) % 60;
      const newS = Math.floor(clampedMs / 1000) % 60;

      setH(pad(newH));
      setM(pad(newM));
      setS(pad(newS));
      setTime(clampedMs);
    },
    [minTime, maxTime, setTime, setH, setM, setS],
  );

  // Reads from valuesRef (not state) so it is safe to call even when triggered
  // synchronously before a batched state update has been committed.
  const handleBlur = React.useCallback(() => {
    const { h, m, s } = valuesRef.current;
    commit(parseInt(h) || 0, parseInt(m) || 0, parseInt(s) || 0);
  }, [commit]);

  const handleHoursChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      const previousLength = valuesRef.current.h.length;
      setH(value); // Update ref before focus() to avoid stale blur
      // Auto-advance only when going from 1 digit to 2, not when editing an
      // already-full field (e.g. inserting a digit in the middle of "30").
      if (value.length >= 2 && previousLength < 2) {
        minutesRef.current?.focus();
        minutesRef.current?.select();
      }
    },
    [setH],
  );

  const handleMinutesChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      const previousLength = valuesRef.current.m.length;
      setM(value);
      if (value.length >= 2 && previousLength < 2) {
        secondsRef.current?.focus();
        secondsRef.current?.select();
      }
    },
    [setM],
  );

  const handleSecondsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "");
      const previousLength = valuesRef.current.s.length;
      setS(value);
      // No field to advance to, so commit immediately once 2 digits are entered
      // to mirror the auto-advance behaviour of the hours and minutes fields.
      if (value.length >= 2 && previousLength < 2) {
        const { h, m } = valuesRef.current;
        commit(parseInt(h) || 0, parseInt(m) || 0, parseInt(value) || 0);
      }
    },
    [setS, commit],
  );

  const handleKeyDown = React.useCallback(
    (field: "h" | "m" | "s") => (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Navigate to the adjacent field when pressing left/right at the boundary.
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const input = e.currentTarget;
        const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
        const atEnd = input.selectionStart === input.value.length && input.selectionEnd === input.value.length;

        if (e.key === "ArrowLeft" && atStart) {
          e.preventDefault();
          if (field === "m") {
            hoursRef.current?.focus();
            hoursRef.current?.select();
          }
          if (field === "s") {
            minutesRef.current?.focus();
            minutesRef.current?.select();
          }
        } else if (e.key === "ArrowRight" && atEnd) {
          e.preventDefault();
          if (field === "h") {
            minutesRef.current?.focus();
            minutesRef.current?.select();
          }
          if (field === "m") {
            secondsRef.current?.focus();
            secondsRef.current?.select();
          }
        }
        return;
      }

      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
      // Prevent the default browser behaviour (cursor movement / page scroll).
      e.preventDefault();
      const delta = e.key === "ArrowUp" ? 1 : -1;
      const { h, m, s } = valuesRef.current;
      commit(
        (parseInt(h) || 0) + (field === "h" ? delta : 0),
        (parseInt(m) || 0) + (field === "m" ? delta : 0),
        (parseInt(s) || 0) + (field === "s" ? delta : 0),
      );
    },
    [commit],
  );

  // Selecting all text on focus lets the user immediately overwrite the value
  // without having to manually clear it first.
  const selectOnFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  return (
    <fieldset className={cn("flex items-center gap-1.5", className)}>
      {legend && <legend>{legend}</legend>}

      <Input
        label="h"
        labelPosition="after"
        inline
        className={LABEL_CLASSNAME}
        inputClassName={INPUT_CLASSNAME}
        type="text"
        inputMode="numeric"
        value={hoursStr}
        onChange={handleHoursChange}
        onFocus={selectOnFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown("h")}
        inputRef={hoursRef}
        aria-label="Heures"
      />

      <Input
        label="m"
        labelPosition="after"
        inline
        className={LABEL_CLASSNAME}
        inputClassName={INPUT_CLASSNAME}
        type="text"
        inputMode="numeric"
        value={minutesStr}
        onChange={handleMinutesChange}
        onFocus={selectOnFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown("m")}
        inputRef={minutesRef}
        aria-label="Minutes"
      />

      <Input
        label="s"
        labelPosition="after"
        inline
        className={LABEL_CLASSNAME}
        inputClassName={INPUT_CLASSNAME}
        type="text"
        inputMode="numeric"
        value={secondsStr}
        onChange={handleSecondsChange}
        onFocus={selectOnFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown("s")}
        inputRef={secondsRef}
        aria-label="Secondes"
      />
    </fieldset>
  );
}
