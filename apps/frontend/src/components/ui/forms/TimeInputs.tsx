import type React from "react";
import { useCallback, useMemo } from "react";
import { cn } from "tailwind-variants";
import { getTimeAsMs } from "../../../utils/mathUtils";
import { prefixNumber } from "../../../utils/utils";
import { Input } from "./Input";

const LABEL_CLASSNAME = "flex items-center gap-0.5";
const INPUT_CLASSNAME = "w-[6ch]";

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

  const hours = useMemo(() => Math.floor(time / 1000 / 60 / 60), [time]);

  const minutes = useMemo(() => Math.floor(time / 1000 / 60) % 60, [time]);

  const seconds = useMemo(() => Math.floor(time / 1000) % 60, [time]);

  const onHoursChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newHours = parseInt(e.target.value);

      if (isNaN(newHours)) {
        return;
      }

      const newTime = getTimeAsMs(newHours, minutes, seconds);

      if (maxTime !== undefined && newTime > maxTime) {
        setTime(maxTime);
        return;
      }

      if (newTime < minTime) {
        setTime(minTime);
        return;
      }

      setTime(newTime);
    },
    [setTime, minTime, maxTime, minutes, seconds],
  );

  const onMinutesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMinutes = parseInt(e.target.value);

      if (isNaN(newMinutes)) {
        return;
      }

      const newTime = getTimeAsMs(hours, newMinutes, seconds);

      if (maxTime !== undefined && newTime > maxTime) {
        setTime(maxTime);
        return;
      }

      if (newTime < minTime) {
        setTime(minTime);
        return;
      }

      setTime(newTime);
    },
    [setTime, minTime, maxTime, hours, seconds],
  );

  const onSecondsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSeconds = parseInt(e.target.value);

      if (isNaN(newSeconds)) {
        return;
      }

      const newTime = getTimeAsMs(hours, minutes, newSeconds);

      if (maxTime !== undefined && newTime > maxTime) {
        setTime(maxTime);
        return;
      }

      if (newTime < minTime) {
        setTime(minTime);
        return;
      }

      setTime(newTime);
    },
    [setTime, minTime, maxTime, hours, minutes],
  );

  return (
    <fieldset className={cn("flex gap-1.5", className)}>
      {legend && <legend>{legend}</legend>}

      <Input
        label="h"
        labelPosition="after"
        inline
        className={LABEL_CLASSNAME}
        inputClassName={INPUT_CLASSNAME}
        type="number"
        value={prefixNumber(hours, 2)}
        onChange={onHoursChange}
      />

      <Input
        label="m"
        labelPosition="after"
        inline
        className={LABEL_CLASSNAME}
        inputClassName={INPUT_CLASSNAME}
        type="number"
        value={prefixNumber(minutes, 2)}
        onChange={onMinutesChange}
      />

      <Input
        label="s"
        labelPosition="after"
        inline
        className={LABEL_CLASSNAME}
        inputClassName={INPUT_CLASSNAME}
        type="number"
        value={prefixNumber(seconds, 2)}
        onChange={onSecondsChange}
      />
    </fieldset>
  );
}
