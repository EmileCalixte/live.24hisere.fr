import type React from "react";
import { getCategory } from "@emilecalixte/ffa-categories";
import { Link } from "react-router-dom";
import type { AdminRace, AdminRunner, RaceRunner } from "@live24hisere/core/types";

interface RaceRunnersTableProps {
  race: AdminRace;
  runners: Array<RaceRunner<AdminRunner>>;
}

export default function RaceRunnersTable({ race, runners }: RaceRunnersTableProps): React.ReactElement {
  return (
    <table className="table no-full-width">
      <thead>
        <tr>
          <th>Dossard</th>
          <th>Nom</th>
          <th>Catégorie</th>
          <th>Arrêté</th>
          <th>Visible public</th>
          <th>Détails du coureur</th>
        </tr>
      </thead>
      <tbody>
        {runners.map((runner) => {
          const category = getCategory(Number(runner.birthYear), { date: new Date(race.startTime) });

          return (
            <tr key={runner.id}>
              <td>{runner.bibNumber}</td>
              <td>
                <Link to={`/admin/runners/${runner.id}`}>
                  {runner.firstname} {runner.lastname}
                </Link>
              </td>
              <td>
                {category.code} - {category.name}
              </td>
              <td>{runner.stopped ? "Oui" : "Non"}</td>
              <td>{runner.isPublic ? "Oui" : "Non"}</td>
              <td>
                <Link to={`/admin/races/${race.id}/runners/${runner.id}`}>Détails</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
