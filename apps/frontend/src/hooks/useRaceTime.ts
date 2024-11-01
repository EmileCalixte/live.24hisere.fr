import { useEffect, useState } from "react";
import { type PublicRace } from "@live24hisere/core/types";
import { getCurrentRaceTime } from "../utils/raceUtils";

const UPDATE_RACE_TIME_INTERVAL = 1000;

export function useRaceTime(race: PublicRace, serverTimeOffset = 0): number {
  const [raceTime, setRaceTime] = useState<number>(getCurrentRaceTime(race, serverTimeOffset));

  useEffect(() => {
    const interval = setInterval(() => {
      setRaceTime(getCurrentRaceTime(race, serverTimeOffset));
    }, UPDATE_RACE_TIME_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [race, serverTimeOffset]);

  return raceTime;
}
