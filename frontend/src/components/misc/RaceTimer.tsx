import React, {useEffect, useMemo, useState} from "react";
import {Race} from "../../types/Race";
import Util from "../../util/Util";
import {app} from "../App";

const RaceTimer: React.FunctionComponent<{
    race: Race
}> = ({race}) => {
    // The current race time
    const [raceTime, setRaceTime] = useState(0);

    const formattedRaceTime = useMemo(() => {
        return Util.formatMsAsDuration(raceTime);
    }, [raceTime]);

    useEffect(() => {
        const updateRaceTime = () => {
            const raceStartMs = new Date(race.startTime).getTime();
            const nowMs = (new Date()).getTime() + (app.state.serverTimeOffset * 1000);

            const raceTime = nowMs - raceStartMs;

            if (raceTime < 0) {
                setRaceTime(0);
                return;
            }

            if (raceTime > race.duration * 1000) {
                setRaceTime(race.duration * 1000);
                return;
            }

            setRaceTime(raceTime);
        };

        const interval = window.setInterval(updateRaceTime, 1000);

        updateRaceTime();

        return () => {
            window.clearInterval(interval);
        }
    }, [race]);

    return (
        <>{formattedRaceTime}</>
    )
}

export default RaceTimer;
