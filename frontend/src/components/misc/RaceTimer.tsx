import {type FunctionComponent, useContext, useEffect, useMemo, useState} from "react";
import {getRaceTime, isRaceFinished, isRaceStarted} from "../../helpers/raceHelper";
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
            if (!isRaceStarted(race, serverTimeOffset) && !allowNegative) {
                setRaceTime(0);
                return;
            }

            if (isRaceFinished(race, serverTimeOffset)) {
                setRaceTime(race.duration * 1000);
                return;
            }

            setRaceTime(getRaceTime(race, serverTimeOffset));
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
