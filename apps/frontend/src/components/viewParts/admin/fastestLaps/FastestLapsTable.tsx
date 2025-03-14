import type React from "react";
import type {
  AdminPassageWithRunnerIdAndRaceId,
  ProcessedPassage,
  RaceDict,
  RaceRunner,
} from "@live24hisere/core/types";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { formatFloatNumber } from "../../../../utils/utils";
import { Link } from "../../../ui/Link";
import { Table, Td, Th, Tr } from "../../../ui/Table";

interface FastestLapsTableProps {
  passages: Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>>;
  races: RaceDict;
  runners: RaceRunner[];
}

export default function FastestLapsTable({ passages, races, runners }: FastestLapsTableProps): React.ReactElement {
  return (
    <Table className="w-full">
      <thead>
        <Tr>
          <Th>#</Th>
          <Th>Coureur</Th>
          <Th>Course</Th>
          <Th>Durée tour</Th>
          <Th>Vitesse tour</Th>
          <Th>Temps de course</Th>
        </Tr>
      </thead>
      <tbody>
        {passages.map((passage) => {
          const runner = runners.find((ru) => ru.id === passage.runnerId);

          if (!runner) {
            return null;
          }

          const race = races[runner.raceId];

          return (
            <Tr key={passage.id}>
              <Td style={{ fontSize: "0.85em" }}>{passage.id}</Td>
              <Td>
                <Link to={`/runner-details/${runner.id}`}>
                  {`${runner.id} – ${runner.firstname} ${runner.lastname}`}
                </Link>
              </Td>
              <Td>{race.name}</Td>
              <Td>{formatMsAsDuration(passage.processed.lapDuration, { forceDisplayHours: false })}</Td>
              <Td>{`${formatFloatNumber(passage.processed.lapSpeed, 2)} km/h`}</Td>
              <Td>
                {`${formatMsAsDuration(passage.processed.lapStartRaceTime)} – ${formatMsAsDuration(passage.processed.lapEndRaceTime)}`}
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
