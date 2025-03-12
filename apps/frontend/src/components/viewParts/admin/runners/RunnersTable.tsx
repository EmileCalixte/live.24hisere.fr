import type React from "react";
import type { AdminRunner, RunnerWithRaceCount } from "@live24hisere/core/types";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../utils/countryUtils";
import { Flag } from "../../../ui/countries/Flag";
import { Link } from "../../../ui/Link";
import { Table, Td, Th, Tr } from "../../../ui/Table";

interface RunnersTableProps {
  runners: Array<RunnerWithRaceCount<AdminRunner>>;
}

export default function RunnersTable({ runners }: RunnersTableProps): React.ReactElement {
  return (
    <Table>
      <thead>
        <Tr>
          <Th>ID</Th>
          <Th>Nom</Th>
          <Th>Sexe</Th>
          <Th>Année naissance</Th>
          <Th>Public</Th>
          <Th>Courses</Th>
          <Th>Détails</Th>
        </Tr>
      </thead>
      <tbody>
        {runners.map((runner) => {
          const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

          return (
            <Tr key={runner.id}>
              <Td>{runner.id}</Td>
              <Td>
                <span className="flex items-center gap-2">
                  {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
                  <span>
                    {runner.lastname.toUpperCase()} {runner.firstname}
                  </span>
                </span>
              </Td>
              <Td>{runner.gender}</Td>
              <Td>{runner.birthYear}</Td>
              <Td>{runner.isPublic ? "Oui" : "Non"}</Td>
              <Td>{runner.raceCount}</Td>
              <Td>
                <Link to={`/admin/runners/${runner.id}`}>Détails</Link>
              </Td>
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
