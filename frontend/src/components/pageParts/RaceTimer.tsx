import {useContext, useMemo} from "react";
import {isRaceFinished, isRaceStarted} from "../../helpers/raceHelper";
import {useRaceTime} from "../../hooks/useRaceTime";
import {formatMsAsDuration} from "../../util/utils";
import {appDataContext} from "../App";

interface RaceTimerProps {
    race: Race;
    allowNegative?: boolean;
}

export default function RaceTimer({race, allowNegative = false}: RaceTimerProps) {
    const {serverTimeOffset} = useContext(appDataContext);

    const raceTime = useRaceTime(race, serverTimeOffset);

    const formattedRaceTime = useMemo(() => {
        if (!isRaceStarted(race, serverTimeOffset) && !allowNegative) {
            return formatMsAsDuration(0);
        }

        if (isRaceFinished(race, serverTimeOffset)) {
            return formatMsAsDuration(race.duration * 1000);
        }

        return formatMsAsDuration(raceTime);
    }, [allowNegative, race, raceTime, serverTimeOffset]);

    return (
        <>{formattedRaceTime}</>
    );
}
