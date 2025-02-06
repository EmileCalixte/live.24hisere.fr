import type React from "react";
import { getCategory } from "@emilecalixte/ffa-categories";
import { Link } from "react-router-dom";
import type { AdminRace, AdminRunner, RaceRunner } from "@live24hisere/core/types";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../utils/countryUtils";
import { Flag } from "../../../ui/countries/Flag";
import RunnerFinalDistanceQuickEdit from "./RunnerFinalDistanceQuickEdit";

interface RaceRunnersTableProps {
  race: AdminRace;
  runners: Array<RaceRunner<AdminRunner>>;
  isEditingFinalDistances: boolean;
}

export default function RaceRunnersTable({
  race,
  runners,
  isEditingFinalDistances,
}: RaceRunnersTableProps): React.ReactElement {
  return (
    <table className="table no-full-width">
      <thead>
        <tr>
          <th>Dossard</th>
          <th>Nom</th>
          <th>Catégorie</th>
          <th>Arrêté</th>
          <th>Visible public</th>
          <th>Détails du participant</th>
          {isEditingFinalDistances && <th>Dist. après dernier passage (m)</th>}
        </tr>
      </thead>
      <tbody>
        {runners.map((runner) => {
          const category = getCategory(Number(runner.birthYear), { date: new Date(race.startTime) });
          const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

          return (
            <tr key={runner.id}>
              <td>{runner.bibNumber}</td>
              <td>
                <span className="d-flex align-items-center gap-2">
                  {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
                  <Link to={`/admin/runners/${runner.id}`}>
                    {runner.firstname} {runner.lastname}
                  </Link>
                </span>
              </td>
              <td>
                {category.code} - {category.name}
              </td>
              <td>{runner.stopped ? "Oui" : "Non"}</td>
              <td>{runner.isPublic ? "Oui" : "Non"}</td>
              <td>
                <Link to={`/admin/races/${race.id}/runners/${runner.id}`}>Détails</Link>
              </td>
              {isEditingFinalDistances && (
                <td>
                  <RunnerFinalDistanceQuickEdit runner={runner} />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
