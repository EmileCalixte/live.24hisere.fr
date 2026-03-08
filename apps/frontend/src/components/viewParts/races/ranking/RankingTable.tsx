import type React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { Ranking, RankingRunner } from "../../../../types/Ranking";
import type { FormatGapMode } from "../../../../utils/runnerUtils";
import { Table, Th, Tr } from "../../../ui/Table";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import RankingTableRow from "./RankingTableRow";

interface RankingTableProps {
  race: PublicRace;
  ranking: Ranking;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
  tableRaceDuration: number | null;
  showLastPassageTime: boolean;
  formatGapMode: FormatGapMode;
  showRunnerStoppedBadges: boolean;
}

export default function RankingTable({
  race,
  ranking,
  tableCategoryCode,
  tableGender,
  tableRaceDuration,
  showLastPassageTime,
  formatGapMode,
  showRunnerStoppedBadges,
}: RankingTableProps): React.ReactElement {
  return (
    <Table id="ranking-table" className="w-full">
      <thead>
        <Tr hoverEffect={false} alternateBgColors={false}>
          <RankingTableInfoHeader
            race={race}
            tableCategoryCode={tableCategoryCode}
            tableGender={tableGender}
            tableRaceDuration={tableRaceDuration}
          />
        </Tr>
        <Tr>
          <Th colSpan={4}>Classement</Th>
          <Th>Doss.</Th>
          <Th>Nom</Th>
          {!race.isBasicRanking && <Th>Nb. tours</Th>}
          <Th>Distance</Th>
          {showLastPassageTime && <Th>Dernier passage</Th>}
          <Th>Vitesse moy.</Th>
          {!race.isBasicRanking && <Th>Écart 1er</Th>}
        </Tr>
      </thead>
      <tbody>
        {ranking.map((runner: RankingRunner) => (
          <RankingTableRow
            key={runner.id}
            race={race}
            runner={runner}
            tableCategoryCode={tableCategoryCode}
            tableGender={tableGender}
            showLastPassageTime={showLastPassageTime}
            formatGapMode={formatGapMode}
            showRunnerStoppedBadges={showRunnerStoppedBadges}
          />
        ))}
      </tbody>
    </Table>
  );
}
