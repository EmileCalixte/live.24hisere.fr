import React from "react";
import { type AdminRunner, type RaceRunner } from "@live24hisere/core/types";
import CircularLoader from "../../../ui/CircularLoader";

interface RaceRunnersTableProps {
  runners: Array<RaceRunner<AdminRunner>>;
}

export default function RaceRunnersTable({ runners }: RaceRunnersTableProps): React.ReactElement {
  return (
    <table className="table no-full-width">
      <thead>
        <tr>
          <th>Dossard</th>
          <th>Nom</th>
          <th>Catégorie</th>
          <th>Arrêté</th>
          <th>Visible public</th>
        </tr>
      </thead>
      <tbody>
        {runners.map((runner) => {
          return (
            <tr key={runner.id}>
              <td>{runner.bibNumber}</td>
              <td>
                {runner.firstname} {runner.lastname}
              </td>
              <td>
                <CircularLoader />
              </td>
              <td>{runner.stopped ? "Oui" : "Non"}</td>
              <td>{runner.isPublic ? "Oui" : "Non"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
