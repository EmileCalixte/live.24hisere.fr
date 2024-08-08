import React, { useContext, useMemo } from "react";
import { useRaceTime } from "../../hooks/useRaceTime";
import { type Race } from "../../types/Race";
import { isRaceFinished, isRaceStarted } from "../../utils/raceUtils";
import { formatMsAsDuration } from "../../utils/utils";
import { appContext } from "../App";

interface RaceTimerProps {
    race: Race;
    allowNegative?: boolean;
}

export default function RaceTimer({
    race,
    allowNegative = false,
}: RaceTimerProps): React.ReactElement {
    const { serverTimeOffset } = useContext(appContext).appData;

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

    return <>{formattedRaceTime}</>;
}
