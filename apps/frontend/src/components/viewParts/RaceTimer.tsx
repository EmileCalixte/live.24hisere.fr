import type React from "react";
import { useContext, useMemo } from "react";
import type { PublicRace } from "@live24hisere/core/types";
import { appContext } from "../../contexts/AppContext";
import { useRaceTime } from "../../hooks/useRaceTime";
import { formatMsAsDuration } from "../../utils/durationUtils";
import { isRaceFinished, isRaceStarted } from "../../utils/raceUtils";

interface RaceTimerProps {
  race: PublicRace;
  allowNegative?: boolean;
}

export default function RaceTimer({ race, allowNegative = false }: RaceTimerProps): React.ReactElement {
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
