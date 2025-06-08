import type React from "react";
import type { AdminRace, AdminRunner, RaceRunner } from "@live24hisere/core/types";
import { useGetRunnerCategory } from "../../../../hooks/useGetRunnerCategory";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../utils/countryUtils";
import { Flag } from "../../../ui/countries/Flag";
import { Link } from "../../../ui/Link";
import { Table, Td, Th, Tr } from "../../../ui/Table";
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
  const getCategory = useGetRunnerCategory();

  return (
    <Table>
      <thead>
        <Tr>
          <Th>Dossard</Th>
          <Th>Nom</Th>
          <Th>Catégorie</Th>
          <Th>Arrêté</Th>
          <Th>Visible public</Th>
          <Th>Détails du participant</Th>
          {isEditingFinalDistances && <Th>Dist. après dernier passage (m)</Th>}
        </Tr>
      </thead>
      <tbody>
        {runners.map((runner) => {
          const category = getCategory(runner, new Date(race.startTime));
          const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

          return (
            <Tr key={runner.id}>
              <Td>{runner.bibNumber}</Td>
              <Td>
                <span className="flex items-center gap-2">
                  {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
                  <Link to={`/admin/runners/${runner.id}`}>
                    {runner.firstname} {runner.lastname}
                  </Link>
                </span>
              </Td>
              <Td>
                {category.code} - {category.name}
              </Td>
              <Td>{runner.stopped ? "Oui" : "Non"}</Td>
              <Td>{runner.isPublic ? "Oui" : "Non"}</Td>
              <Td>
                <Link to={`/admin/races/${race.id}/runners/${runner.id}`}>Détails</Link>
              </Td>
              {isEditingFinalDistances && (
                <Td>
                  <RunnerFinalDistanceQuickEdit runner={runner} />
                </Td>
              )}
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
