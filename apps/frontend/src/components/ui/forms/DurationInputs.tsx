import type React from "react";
import { useCallback, useMemo } from "react";
import clsx from "clsx";
import { getDurationAsMs } from "../../../utils/mathUtils";
import { prefixNumber } from "../../../utils/utils";

const LABEL_CLASSNAME = "flex items-center gap-0.5";
const INPUT_CLASSNAME = "text-[0.9em] w-[6ch]";

interface DurationInputsProps {
  legend?: string;
  className?: string;

  /**
   * The duration, in ms
   */
  duration: number;

  /**
   * Minimum duration, in ms
   */
  minDuration?: number;

  /**
   * Maximum duration, in ms
   */
  maxDuration?: number;

  /**
   * @param duration The new duration, in ms
   */
  setDuration: (duration: number) => void;
}

export default function DurationInputs({
  legend,
  className,
  duration,
  minDuration = 0,
  maxDuration,
  setDuration,
}: DurationInputsProps): React.ReactElement {
  if (minDuration < 0) {
    throw new Error("minDuration cannot be negative");
  }

  const hours = useMemo(() => Math.floor(duration / 1000 / 60 / 60), [duration]);

  const minutes = useMemo(() => Math.floor(duration / 1000 / 60) % 60, [duration]);

  const seconds = useMemo(() => Math.floor(duration / 1000) % 60, [duration]);

  const onHoursChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHours = parseInt(e.target.value);

      if (isNaN(newHours)) {
        return;
      }

      const newDuration = getDurationAsMs(newHours, minutes, seconds);

      if (maxDuration !== undefined && newDuration > maxDuration) {
        setDuration(maxDuration);
        return;
      }

      if (newDuration < minDuration) {
        setDuration(minDuration);
        return;
      }

      setDuration(newDuration);
    },
    [setDuration, minDuration, maxDuration, minutes, seconds],
  );

  const onMinutesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMinutes = parseInt(e.target.value);

      if (isNaN(newMinutes)) {
        return;
      }

      const newDuration = getDurationAsMs(hours, newMinutes, seconds);

      if (maxDuration !== undefined && newDuration > maxDuration) {
        setDuration(maxDuration);
        return;
      }

      if (newDuration < minDuration) {
        setDuration(minDuration);
        return;
      }

      setDuration(newDuration);
    },
    [setDuration, minDuration, maxDuration, hours, seconds],
  );

  const onSecondsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSeconds = parseInt(e.target.value);

      if (isNaN(newSeconds)) {
        return;
      }

      const newDuration = getDurationAsMs(hours, minutes, newSeconds);

      if (maxDuration !== undefined && newDuration > maxDuration) {
        setDuration(maxDuration);
        return;
      }

      if (newDuration < minDuration) {
        setDuration(minDuration);
        return;
      }

      setDuration(newDuration);
    },
    [setDuration, minDuration, maxDuration, hours, minutes],
  );

  return (
    <fieldset className={clsx("flex gap-1.5", className)}>
      {legend && <legend>{legend}</legend>}

      <label className={LABEL_CLASSNAME}>
        <input
          className={clsx("input", INPUT_CLASSNAME)}
          type="number"
          value={prefixNumber(hours, 2)}
          onChange={onHoursChange}
        />
        h
      </label>
      <label className={LABEL_CLASSNAME}>
        <input
          className={clsx("input", INPUT_CLASSNAME)}
          type="number"
          value={prefixNumber(minutes, 2)}
          onChange={onMinutesChange}
        />
        m
      </label>
      <label className={LABEL_CLASSNAME}>
        <input
          className={clsx("input", INPUT_CLASSNAME)}
          type="number"
          value={prefixNumber(seconds, 2)}
          onChange={onSecondsChange}
        />
        s
      </label>
    </fieldset>
  );
}
