import type React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { SplitDistanceRanking, SplitDistanceRankingRunner } from "../../../../types/Ranking";
import { Table, Th, Tr } from "../../../ui/Table";
import Split100KmTableInfoHeader from "./Split100KmTableInfoHeader";
import Split100KmTableRow from "./Split100KmTableRow";

interface Split100KmTableProps {
  race: PublicRace;
  ranking: SplitDistanceRanking;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
}

export default function Split100KmTable({
  race,
  ranking,
  tableCategoryCode,
  tableGender,
}: Split100KmTableProps): React.ReactElement {
  return (
    <Table id="ranking-table" className="w-full">
      <thead>
        <Tr hoverEffect={false} alternateBgColors={false}>
          <Split100KmTableInfoHeader race={race} tableCategoryCode={tableCategoryCode} tableGender={tableGender} />
        </Tr>
        <Tr>
          <Th colSpan={4}>Classement</Th>
          <Th>Doss.</Th>
          <Th>Nom</Th>
          <Th>Temps à 100 km</Th>
          <Th>Vitesse moy.</Th>
        </Tr>
      </thead>
      <tbody>
        {ranking.map((runner: SplitDistanceRankingRunner) => (
          <Split100KmTableRow
            key={runner.id}
            race={race}
            runner={runner}
            tableCategoryCode={tableCategoryCode}
            tableGender={tableGender}
          />
        ))}
      </tbody>
    </Table>
  );
}
