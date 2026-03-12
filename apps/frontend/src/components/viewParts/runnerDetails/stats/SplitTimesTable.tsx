import type React from "react";
import type { RunnerProcessedDistanceSlot } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../../constants/misc";
import { WINDOW_WIDTH_BREAKPOINTS } from "../../../../constants/ui/sizing";
import { useWindowDimensions } from "../../../../hooks/useWindowDimensions";
import { formatMsAsDuration, formatMsDurationHms } from "../../../../utils/durationUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Table, Td, Th, Tr } from "../../../ui/Table";
import ResponsiveSplitTimesTable from "./responsive/ResponsiveSplitTimesTable";

const RESPONSIVE_TABLE_MAX_WINDOW_WIDTH = WINDOW_WIDTH_BREAKPOINTS.LG;

interface SplitTimesTableProps {
  slots: RunnerProcessedDistanceSlot[];
}

export function SplitTimesTable({ slots }: SplitTimesTableProps): React.ReactElement {
  const { width: windowWidth } = useWindowDimensions();

  if (slots.length === 0) {
    return <></>;
  }

  if (windowWidth <= RESPONSIVE_TABLE_MAX_WINDOW_WIDTH) {
    return <ResponsiveSplitTimesTable slots={slots} />;
  }

  return (
    <Table>
      <thead>
        <Tr hoverEffect={false} alternateBgColors={false}>
          <Th>Section</Th>
          <Th>Début</Th>
          <Th>Fin</Th>
          <Th>Durée</Th>
          <Th>Vitesse moy.</Th>
          <Th>Allure moy.</Th>
        </Tr>
      </thead>
      <tbody>
        {slots.map((slot) => {
          const isApproximate = !slot.startRaceTimeExact || !slot.endRaceTimeExact;

          return (
            <Tr key={`${slot.startDistance}-${slot.endDistance}`}>
              <Td className="whitespace-nowrap">
                {formatFloatNumber(slot.startDistance / 1000, 1, 3)} km →{" "}
                {formatFloatNumber(slot.endDistance / 1000, 1, 3)} km
              </Td>

              <Td className="whitespace-nowrap">
                {!slot.startRaceTimeExact && <>≈&nbsp;</>}
                {formatMsAsDuration(slot.startRaceTime)}
              </Td>

              <Td className="whitespace-nowrap">
                {!slot.endRaceTimeExact && <>≈&nbsp;</>}
                {formatMsAsDuration(slot.endRaceTime)}
              </Td>

              <Td className="whitespace-nowrap">
                {isApproximate && <>≈&nbsp;</>}
                {formatMsAsDuration(slot.duration)}
              </Td>

              <Td>
                {slot.averageSpeed !== null ? (
                  <>{formatFloatNumber(slot.averageSpeed, 2)} km/h</>
                ) : (
                  NO_VALUE_PLACEHOLDER
                )}
              </Td>

              <Td className="whitespace-nowrap">
                {slot.averagePace !== null ? (
                  <>
                    {formatMsDurationHms(slot.averagePace)}
                    {" / km"}
                  </>
                ) : (
                  NO_VALUE_PLACEHOLDER
                )}
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
