import type React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { SplitDistanceRanking, SplitDistanceRankingRunner } from "../../../../../types/Ranking";
import { Table, Tr } from "../../../../ui/Table";
import Split100KmTableInfoHeader from "../Split100KmTableInfoHeader";
import ResponsiveSplit100KmTableRow from "./ResponsiveSplit100KmTableRow";

interface ResponsiveSplit100KmTableProps {
  race: PublicRace;
  ranking: SplitDistanceRanking;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
}

export default function ResponsiveSplit100KmTable({
  race,
  ranking,
  tableCategoryCode,
  tableGender,
}: ResponsiveSplit100KmTableProps): React.ReactElement {
  return (
    <Table id="ranking-table">
      <thead>
        <Tr hoverEffect={false} alternateBgColors={false}>
          <Split100KmTableInfoHeader race={race} tableCategoryCode={tableCategoryCode} tableGender={tableGender} />
        </Tr>
      </thead>
      <tbody>
        {ranking.map((runner: SplitDistanceRankingRunner) => (
          <ResponsiveSplit100KmTableRow
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
