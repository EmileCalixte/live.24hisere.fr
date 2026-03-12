import type React from "react";
import type { RunnerProcessedDistanceSlot } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../../../constants/misc";
import { formatMsAsDuration, formatMsDurationHms } from "../../../../../utils/durationUtils";
import { formatFloatNumber } from "../../../../../utils/utils";
import { Td, Tr } from "../../../../ui/Table";

interface ResponsiveSplitTimesTableRowProps {
  slot: RunnerProcessedDistanceSlot;
}

export default function ResponsiveSplitTimesTableRow({ slot }: ResponsiveSplitTimesTableRowProps): React.ReactElement {
  const isApproximate = !slot.startRaceTimeExact || !slot.endRaceTimeExact;

  return (
    <Tr>
      <Td className="w-full">
        <div className="font-bold">
          {formatFloatNumber(slot.startDistance / 1000, 1, 3)} km → {formatFloatNumber(slot.endDistance / 1000, 1, 3)}{" "}
          km
        </div>

        <div className="text-sm">
          Début&nbsp;:{" "}
          <strong>
            {!slot.startRaceTimeExact && <>≈&nbsp;</>}
            {formatMsAsDuration(slot.startRaceTime)}
          </strong>
          {" – "}
          Fin&nbsp;:{" "}
          <strong>
            {!slot.endRaceTimeExact && <>≈&nbsp;</>}
            {formatMsAsDuration(slot.endRaceTime)}
          </strong>
        </div>

        <div className="text-sm">
          Durée&nbsp;:{" "}
          <strong>
            {isApproximate && <>≈&nbsp;</>}
            {formatMsAsDuration(slot.duration)}
          </strong>
        </div>

        <div className="text-sm">
          {slot.averageSpeed !== null ? (
            <>
              {formatFloatNumber(slot.averageSpeed, 2)} km/h &nbsp;–&nbsp;
              {formatMsDurationHms(slot.averagePace ?? 0)} / km
            </>
          ) : (
            NO_VALUE_PLACEHOLDER
          )}
        </div>
      </Td>
    </Tr>
  );
}
