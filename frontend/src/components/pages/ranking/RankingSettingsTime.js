import {useState} from "react";
import Util from "../../../util/Util";

export const MAX_HOURS = 24;
export const MAX_MINUTES_AT_MAX_HOURS = 0;
export const MAX_SECONDS_AT_MAX_MINUTES = 0;

const RankingSettingsTime = ({isVisible}) => {
    // The current input values, saved or not
    const [hours, setHours] = useState(MAX_HOURS);
    const [minutes, setMinutes] = useState(MAX_MINUTES_AT_MAX_HOURS);
    const [seconds, setSeconds] = useState(MAX_SECONDS_AT_MAX_MINUTES);

    const onFocus = (e) => {
        e.target.select();
    }

    const onHourChange = (e) => {
        const newValue = parseInt(e.target.value);

        if (newValue >= MAX_HOURS) {
            setHours(MAX_HOURS);
            capValues(newValue, minutes, seconds);
            return;
        }

        if (newValue < 0) {
            setHours(0);
            return;
        }

        setHours(newValue);
        capValues(newValue, minutes, seconds);
    }

    const onMinuteChange = (e) => {
        const newValue = parseInt(e.target.value);

        if (newValue >= 60) {
            if (!incrementHours()) {
                return;
            }

            setMinutes(newValue % 60);
            capValues(hours + 1, newValue, seconds);
            return;
        }

        if (newValue < 0) {
            if (!decrementHours()) {
                return;
            }

            setMinutes(newValue % 60 + 60);
            return;
        }

        setMinutes(newValue);
        capValues(hours, newValue, seconds);
    }

    const onSecondChange = (e) => {
        const newValue = parseInt(e.target.value);

        if (newValue >= 60) {
            if (!incrementMinutes()) { // FIXME when hours are incremented too
                return;
            }

            setSeconds(newValue % 60);
            capValues(hours, minutes + 1, newValue);
            return;
        }

        if (newValue < 0) {
            if (!decrementMinutes()) {
                return;
            }

            setSeconds(newValue % 60 + 60);
            return;
        }

        setSeconds(newValue);
        capValues(hours, minutes, newValue);
    }

    const incrementHours = () => {
        if (hours >= MAX_HOURS) {
            return false;
        }

        setHours(hours + 1);

        return true;
    }

    const decrementHours = () => {
        if (hours <= 0) {
            return false;
        }

        setHours(hours - 1);

        return true;
    }

    const incrementMinutes = () => {
        if (minutes >= 59) {
            if (!incrementHours()) {
                return false;
            }

            setMinutes(0);
            return true;
        }

        setMinutes(minutes + 1);

        return true;
    }

    const decrementMinutes = () => {
        if (minutes <= 0) {
            if (!decrementHours()) {
                return false;
            }

            setMinutes(59);
            return true;
        }

        setMinutes(minutes - 1);

        return true;
    }

    const capValues = (hours, minutes, seconds) => {
        const newValues = {
            hours,
            minutes,
            seconds,
        };

        if (hours < MAX_HOURS) {
            return newValues;
        }

        if (minutes < MAX_MINUTES_AT_MAX_HOURS) {
            return newValues;
        }

        setMinutes(MAX_MINUTES_AT_MAX_HOURS);
        newValues.minutes = MAX_MINUTES_AT_MAX_HOURS;

        if (seconds < MAX_SECONDS_AT_MAX_MINUTES) {
            return newValues;
        }

        setSeconds(MAX_SECONDS_AT_MAX_MINUTES);
        newValues.seconds = MAX_SECONDS_AT_MAX_MINUTES;

        return newValues;
    }

    const getValuesAsMs = (hours, minutes, seconds) => {
        return (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setTime(getValuesAsMs(hours, minutes, seconds));
    }

    // The saved time in ms
    const [time, setTime] = useState(getValuesAsMs(MAX_HOURS, MAX_MINUTES_AT_MAX_HOURS, MAX_SECONDS_AT_MAX_MINUTES));

    return (
        <form
            className="inline-input-group"
            style={{visibility: isVisible ? 'visible' : 'hidden'}}
            onSubmit={onSubmit}
        >
            <label style={{marginLeft: -5}}>
                <input
                    className="input race-time-input"
                    type="number"
                    value={Util.prefixNumber(hours, 2)}
                    name="race-time-hours"
                    onFocus={onFocus}
                    onChange={onHourChange}
                />
                h
            </label>
            <label>
                <input
                    className="input race-time-input"
                    type="number"
                    value={Util.prefixNumber(minutes, 2)}
                    name="race-time-minutes"
                    onFocus={onFocus}
                    onChange={onMinuteChange}
                />
                m
            </label>
            <label>
                <input
                    className="input race-time-input"
                    type="number"
                    value={Util.prefixNumber(seconds, 2)}
                    name="race-time-seconds"
                    onFocus={onFocus}
                    onChange={onSecondChange}
                />
                s
            </label>

            <button
                className="button"
                disabled={time === getValuesAsMs(hours, minutes, seconds)}
                style={{marginLeft: 10}}
            >
                OK
            </button>

            {getValuesAsMs(hours, minutes, seconds)} {time}
        </form>
    );
}

export default RankingSettingsTime;
