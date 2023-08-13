import React, { useCallback, useMemo } from "react";
import { getDurationAsMs } from "../../../helpers/durationHelper";
import { prefixNumber } from "../../../util/utils";

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
    setDuration: (duration: number) => any;
}

export default function DurationInputs({
    legend,
    className,
    duration,
    minDuration = 0,
    maxDuration,
    setDuration,
}: DurationInputsProps): JSX.Element {
    if (minDuration < 0) {
        throw new Error("minDuration cannot be negative");
    }

    const hours = useMemo(() => {
        return Math.floor(duration / 1000 / 60 / 60);
    }, [duration]);

    const minutes = useMemo(() => {
        return Math.floor(duration / 1000 / 60) % 60;
    }, [duration]);

    const seconds = useMemo(() => {
        return Math.floor(duration / 1000) % 60;
    }, [duration]);

    const onHoursChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    }, [setDuration, minDuration, maxDuration, minutes, seconds]);

    const onMinutesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    }, [setDuration, minDuration, maxDuration, hours, seconds]);

    const onSecondsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    }, [setDuration, minDuration, maxDuration, hours, minutes]);

    return (
        <fieldset className={className}>
            {legend &&
                <legend>{legend}</legend>
            }
            <label style={{ marginLeft: -5 }}>
                <input className="input race-time-input"
                       type="number"
                       value={prefixNumber(hours, 2)}
                       onChange={onHoursChange}
                />
                h
            </label>
            <label>
                <input className="input race-time-input"
                       type="number"
                       value={prefixNumber(minutes, 2)}
                       onChange={onMinutesChange}
                />
                m
            </label>
            <label>
                <input className="input race-time-input"
                       type="number"
                       value={prefixNumber(seconds, 2)}
                       onChange={onSecondsChange}
                />
                s
            </label>
        </fieldset>
    );
}
