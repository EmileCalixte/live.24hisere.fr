import {type FunctionComponent, useContext, useEffect, useMemo, useState} from "react";
import {type Race} from "../../types/Race";
import {formatMsAsDuration} from "../../util/utils";
import {appDataContext} from "../App";

interface RaceTimerProps {
    race: Race;
    allowNegative?: boolean;
}

const RaceTimer: FunctionComponent<RaceTimerProps> = ({race, allowNegative = false}) => {
    const {serverTimeOffset} = useContext(appDataContext);

    // The current race time
    const [raceTime, setRaceTime] = useState(0);

    const formattedRaceTime = useMemo(() => {
        return formatMsAsDuration(raceTime);
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

        return () => window.clearInterval(interval);
    }, [serverTimeOffset, race, allowNegative]);

    return (
        <>{formattedRaceTime}</>
    );
};

export default RaceTimer;
