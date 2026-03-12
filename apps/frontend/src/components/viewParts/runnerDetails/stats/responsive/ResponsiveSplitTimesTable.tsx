import type React from "react";
import type { RunnerProcessedDistanceSlot } from "@live24hisere/core/types";
import { Table } from "../../../../ui/Table";
import ResponsiveSplitTimesTableRow from "./ResponsiveSplitTimesTableRow";

interface ResponsiveSplitTimesTableProps {
  slots: RunnerProcessedDistanceSlot[];
}

export default function ResponsiveSplitTimesTable({ slots }: ResponsiveSplitTimesTableProps): React.ReactElement {
  return (
    <Table className="w-full">
      <tbody>
        {slots.map((slot) => (
          <ResponsiveSplitTimesTableRow key={`${slot.startDistance}-${slot.endDistance}`} slot={slot} />
        ))}
      </tbody>
    </Table>
  );
}
