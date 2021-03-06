import React, {useCallback, useEffect, useState} from "react";
import {app} from "../../App";
import Util from "../../../util/Util";

const maxDuration = 24 * 60 * 60 * 1000;

const HeaderTimer = () => {
    const [durationString, setDurationString] = useState('--:--:--');

    const computeDurationString = useCallback(() => {
        const raceStartMs = app.state.raceStartTime.getTime();
        const nowMs = (new Date()).getTime() + (app.state.serverTimeOffset * 1000);
        const raceDurationMs = Math.min(Math.max(0, nowMs - raceStartMs), maxDuration);

        setDurationString(Util.formatMsAsDuration(raceDurationMs));
    }, []);

    useEffect(() => {
        const updateTimerInterval = setInterval(() => {
            computeDurationString();
        }, 1000);

        computeDurationString();

        return () => {
            clearInterval(updateTimerInterval);
        }
    }, [computeDurationString]);

    return (
        <div className="header-timer-container">
            <span className="header-timer">
                {durationString}
            </span>
        </div>
    );
}

export default HeaderTimer;
