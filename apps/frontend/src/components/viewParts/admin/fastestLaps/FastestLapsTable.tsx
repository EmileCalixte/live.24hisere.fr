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

interface FastestLapsTableProps {
  passages: Array<ProcessedPassage<AdminPassageWithRunnerIdAndRaceId>>;
  races: RaceDict;
  runners: RaceRunner[];
}

export default function FastestLapsTable({ passages, races, runners }: FastestLapsTableProps): React.ReactElement {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Coureur</th>
          <th>Course</th>
          <th>Durée tour</th>
          <th>Vitesse tour</th>
          <th>Temps de course</th>
        </tr>
      </thead>
      <tbody>
        {passages.map((passage) => {
          const runner = runners.find((ru) => ru.id === passage.runnerId);

          if (!runner) {
            return null;
          }

          const race = races[runner.raceId];

          return (
            <tr key={passage.id}>
              <td style={{ fontSize: "0.85em" }}>{passage.id}</td>
              <td>
                <Link to={`/runner-details/${runner.id}`}>
                  {`${runner.id} – ${runner.firstname} ${runner.lastname}`}
                </Link>
              </td>
              <td>{race.name}</td>
              <td>{formatMsAsDuration(passage.processed.lapDuration, { forceDisplayHours: false })}</td>
              <td>{`${formatFloatNumber(passage.processed.lapSpeed, 2)} km/h`}</td>
              <td>
                {`${formatMsAsDuration(passage.processed.lapStartRaceTime)} – ${formatMsAsDuration(passage.processed.lapEndRaceTime)}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
