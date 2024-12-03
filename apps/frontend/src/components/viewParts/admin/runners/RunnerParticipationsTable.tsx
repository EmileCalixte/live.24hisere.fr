import React from "react";
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
        </tr>
      </thead>
      <tbody>
        {participations.map((participation) => {
          const race = races?.find((race) => race.id === participation.raceId);
          const edition = editions?.find((edition) => edition.id === race?.editionId);

          return (
            <tr key={participation.id}>
              <td>{editions ? edition?.name : <CircularLoader />}</td>
              <td>{races ? race?.name : <CircularLoader />}</td>
              <td>{participation.bibNumber}</td>
              <td>{participation.stopped ? "Oui" : "Non"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
