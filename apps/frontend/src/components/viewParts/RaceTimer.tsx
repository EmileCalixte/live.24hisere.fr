import React, { useContext, useMemo } from "react";
import { type PublicRace } from "@live24hisere/core/types";
import { useRaceTime } from "../../hooks/useRaceTime";
import { isRaceFinished, isRaceStarted } from "../../utils/raceUtils";
import { formatMsAsDuration } from "../../utils/utils";
import { appContext } from "../App";

interface RaceTimerProps {
    race: PublicRace;
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
