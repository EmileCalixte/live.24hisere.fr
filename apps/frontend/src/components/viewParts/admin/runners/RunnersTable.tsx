import React from "react";
import { Link } from "react-router-dom";
import { type AdminRunner, type RunnerWithRaceCount } from "@live24hisere/core/types";

interface RunnersTableProps {
  runners: Array<RunnerWithRaceCount<AdminRunner>>;
}

export default function RunnersTable({ runners }: RunnersTableProps): React.ReactElement {
  return (
    <table className="table no-full-width">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Sexe</th>
          <th>Année naissance</th>
          <th>Courses</th>
          <th>Détails</th>
        </tr>
      </thead>
      <tbody>
        {runners.map((runner) => {
          return (
            <tr key={runner.id}>
              <td>{runner.id}</td>
              <td>
                {runner.lastname.toUpperCase()} {runner.firstname}
              </td>
              <td>{runner.gender}</td>
              <td>{runner.birthYear}</td>
              <td>{runner.raceCount}</td>
              <td>
                <Link to={`/admin/runners/${runner.id}`}>Détails</Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
