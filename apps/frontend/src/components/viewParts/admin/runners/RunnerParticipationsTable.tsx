import React from "react";
import { Link } from "react-router-dom";
import { type AdminEdition, type AdminRace, type Participant } from "@live24hisere/core/types";
import CircularLoader from "../../../ui/CircularLoader";

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
    <table className="table no-full-width">
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
