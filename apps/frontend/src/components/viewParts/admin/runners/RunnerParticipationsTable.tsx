import type React from "react";
import type { AdminEdition, AdminRace, Participant } from "@live24hisere/core/types";
import CircularLoader from "../../../ui/CircularLoader";
import { Link } from "../../../ui/Link";
import { Table, Td, Th, Tr } from "../../../ui/Table";

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
    <Table>
      <thead>
        <Tr>
          <Th>Édition</Th>
          <Th>Course</Th>
          <Th>Dossard</Th>
          <Th>Arrêté</Th>
          <Th>Détails participation</Th>
        </Tr>
      </thead>
      <tbody>
        {participations.map((participation) => {
          const race = races?.find((race) => race.id === participation.raceId);
          const edition = editions?.find((edition) => edition.id === race?.editionId);

          return (
            <Tr key={participation.id}>
              <Td>
                {!editions && <CircularLoader />}

                {edition && <Link to={`/admin/editions/${edition.id}`}>{edition.name}</Link>}
              </Td>
              <Td>
                {!races && <CircularLoader />}

                {race && <Link to={`/admin/races/${race.id}`}>{race.name}</Link>}
              </Td>
              <Td>{participation.bibNumber}</Td>
              <Td>{participation.stopped ? "Oui" : "Non"}</Td>
              <Td>
                {!races && <CircularLoader />}

                {race && <Link to={`/admin/races/${race.id}/runners/${participation.runnerId}`}>Détails</Link>}
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
