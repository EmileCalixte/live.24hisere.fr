import React, {useContext, useEffect, useMemo, useState} from "react";
import {Race} from "../../types/Race";
import Util from "../../util/Util";
import {serverTimeOffsetContext} from "../App";

const RaceTimer: React.FunctionComponent<{
    race: Race,
    allowNegative?: boolean
}> = ({race, allowNegative = false}) => {
    const {serverTimeOffset} = useContext(serverTimeOffsetContext);

    // The current race time
    const [raceTime, setRaceTime] = useState(0);

    const formattedRaceTime = useMemo(() => {
        return Util.formatMsAsDuration(raceTime);
    }, [raceTime]);

    useEffect(() => {
        const updateRaceTime = () => {
            const raceStartMs = new Date(race.startTime).getTime();
            const nowMs = (new Date()).getTime() + (serverTimeOffset * 1000);

            const raceTime = nowMs - raceStartMs;

            if (raceTime < 0 && !allowNegative) {
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
    }, [race, allowNegative]);

    return (
        <>{formattedRaceTime}</>
    )
}

export default RaceTimer;
