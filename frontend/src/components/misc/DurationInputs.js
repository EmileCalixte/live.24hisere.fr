import {useCallback, useMemo} from "react";
import Util from "../../util/Util";

export const getDurationAsMs = (hours, minutes, seconds) => {
    return (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
}

/**
 *
 * @param duration in ms
 * @param minDuration in ms, must be >= 0
 * @param maxDuration in ms
 * @param setDuration
 * @return {JSX.Element}
 * @constructor
 */
const DurationInputs = ({
    duration,
    minDuration = 0,
    maxDuration,
    setDuration,
}) => {
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

    const onHoursChange = useCallback((e) => {
        const newHours = parseInt(e.target.value);

        if (isNaN(newHours)) {
            return;
        }

        const newDuration = getDurationAsMs(newHours, minutes, seconds);

        if (newDuration > maxDuration) {
            setDuration(maxDuration);
            return;
        }

        if (newDuration < minDuration) {
            setDuration(minDuration);
            return;
        }

        setDuration(newDuration);
    }, [setDuration, minDuration, maxDuration, minutes, seconds]);

    const onMinutesChange = useCallback((e) => {
        const newMinutes = parseInt(e.target.value);

        if (isNaN(newMinutes)) {
            return;
        }

        const newDuration = getDurationAsMs(hours, newMinutes, seconds);

        if (newDuration > maxDuration) {
            setDuration(maxDuration);
            return;
        }

        if (newDuration < minDuration) {
            setDuration(minDuration);
            return;
        }

        setDuration(newDuration);
    }, [setDuration, minDuration, maxDuration, hours, seconds]);

    const onSecondsChange = useCallback((e) => {
        const newSeconds = parseInt(e.target.value);

        if (isNaN(newSeconds)) {
            return;
        }

        const newDuration = getDurationAsMs(hours, minutes, newSeconds);

        if (newDuration > maxDuration) {
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
        <>
            <label style={{marginLeft: -5}}>
                <input className="input race-time-input"
                       type="number"
                       value={Util.prefixNumber(hours, 2)}
                       onChange={onHoursChange}
                />
                h
            </label>
            <label>
                <input className="input race-time-input"
                       type="number"
                       value={Util.prefixNumber(minutes, 2)}
                       onChange={onMinutesChange}
                />
                m
            </label>
            <label>
                <input className="input race-time-input"
                       type="number"
                       value={Util.prefixNumber(seconds, 2)}
                       onChange={onSecondsChange}
                />
                s
            </label>
        </>
    );
}

export default DurationInputs;
