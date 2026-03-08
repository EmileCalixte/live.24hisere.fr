import type React from "react";
import type { PassageWithRunner, ProcessedPassage, PublicRace, RaceRunner } from "@live24hisere/core/types";
import { Table } from "../../../../ui/Table";
import ResponsiveFastestLapsTableRow from "./ResponsiveFastestLapsTableRow";

interface ResponsiveFastestLapsTableProps {
  race: PublicRace;
  passages: Array<PassageWithRunner<ProcessedPassage, RaceRunner>>;
}

export default function ResponsiveFastestLapsTable({
  race,
  passages,
}: ResponsiveFastestLapsTableProps): React.ReactElement {
  return (
    <Table>
      <tbody>
        {passages.map((passage) => (
          <ResponsiveFastestLapsTableRow key={passage.id} race={race} passage={passage} />
        ))}
      </tbody>
    </Table>
  );
}
