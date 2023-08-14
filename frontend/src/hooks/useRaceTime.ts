import { useEffect, useState } from "react";
import { getRaceTime } from "../helpers/raceHelper";
import { type Race } from "../types/Race";

const UPDATE_RACE_TIME_INTERVAL = 1000;

export function useRaceTime(race: Race, serverTimeOffset = 0): number {
    const [raceTime, setRaceTime] = useState<number>(getRaceTime(race, serverTimeOffset));

    useEffect(() => {
        const interval = setInterval(() => { setRaceTime(getRaceTime(race, serverTimeOffset)); }, UPDATE_RACE_TIME_INTERVAL);

        return () => { clearInterval(interval); };
    }, [race, serverTimeOffset]);

    return raceTime;
}
