import type React from "react";
import type { AdminEdition, AdminRace, Participant } from "@live24hisere/core/types";
import CircularLoader from "../../../ui/CircularLoader";
import { Link } from "../../../ui/Link";

interface RunnerParticipationsTableProps {
  participations: Participant[];
  editions: AdminEdition[] | undefined;
  races: AdminRace[] | undefined;
}

export default function RunnerParticipationsTable({
  participations,
  editions,
  races,
}: RunnerParticipationsTableProps): React.ReactElement {
  return (
    <table className="no-full-width table">
      <thead>
        <tr>
          <th>Édition</th>
          <th>Course</th>
          <th>Dossard</th>
          <th>Arrêté</th>
          <th>Détails participation</th>
        </tr>
      </thead>
      <tbody>
        {participations.map((participation) => {
          const race = races?.find((race) => race.id === participation.raceId);
          const edition = editions?.find((edition) => edition.id === race?.editionId);

          return (
            <tr key={participation.id}>
              <td>
                {!editions && <CircularLoader />}

                {edition && <Link to={`/admin/editions/${edition.id}`}>{edition.name}</Link>}
              </td>
              <td>
                {!races && <CircularLoader />}

                {race && <Link to={`/admin/races/${race.id}`}>{race.name}</Link>}
              </td>
              <td>{participation.bibNumber}</td>
              <td>{participation.stopped ? "Oui" : "Non"}</td>
              <td>
                {!races && <CircularLoader />}

                {race && <Link to={`/admin/races/${race.id}/runners/${participation.runnerId}`}>Détails</Link>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
