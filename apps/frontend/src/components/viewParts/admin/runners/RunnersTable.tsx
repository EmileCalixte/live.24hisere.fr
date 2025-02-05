import type React from "react";
import { Link } from "react-router-dom";
import type { AdminRunner, RunnerWithRaceCount } from "@live24hisere/core/types";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../utils/countryUtils";
import { Flag } from "../../../ui/countries/Flag";

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
          const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

          return (
            <tr key={runner.id}>
              <td>{runner.id}</td>
              <td>
                <span className="d-flex align-items-center gap-2">
                  {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
                  <span>
                    {runner.lastname.toUpperCase()} {runner.firstname}
                  </span>
                </span>
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
