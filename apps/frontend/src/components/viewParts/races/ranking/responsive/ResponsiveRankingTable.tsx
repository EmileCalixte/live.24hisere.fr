import type React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { Ranking, RankingRunner } from "../../../../../types/Ranking";
import type { FormatGapMode } from "../../../../../utils/runnerUtils";
import { Table, Tr } from "../../../../ui/Table";
import RankingTableInfoHeader from "../RankingTableInfoHeader";
import ResponsiveRankingTableRow from "./ResponsiveRankingTableRow";

interface ResponsiveRankingTableProps {
  race: PublicRace;
  ranking: Ranking;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
  tableRaceDuration: number | null;
  showLastPassageTime: boolean;
  formatGapMode: FormatGapMode;
  showRunnerStoppedBadges: boolean;
}

export default function ResponsiveRankingTable({
  race,
  ranking,
  tableCategoryCode,
  tableGender,
  tableRaceDuration,
  showLastPassageTime,
  formatGapMode,
  showRunnerStoppedBadges,
}: ResponsiveRankingTableProps): React.ReactElement {
  return (
    <Table id="ranking-table">
      <thead>
        <Tr hoverEffect={false} alternateBgColors={false}>
          <RankingTableInfoHeader
            race={race}
            tableCategoryCode={tableCategoryCode}
            tableGender={tableGender}
            tableRaceDuration={tableRaceDuration}
          />
        </Tr>
      </thead>
      <tbody>
        {ranking.map((runner: RankingRunner) => (
          <ResponsiveRankingTableRow
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
