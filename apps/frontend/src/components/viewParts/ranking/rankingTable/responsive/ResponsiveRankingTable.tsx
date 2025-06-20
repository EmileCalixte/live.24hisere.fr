import React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { useGetRunnerCategory } from "../../../../../hooks/useGetRunnerCategory";
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
  const getCategory = useGetRunnerCategory();

  const getRankingTableRow = React.useCallback(
    (rankingRunner: RankingRunner) => {
      const runnerCategoryCode = getCategory(rankingRunner, new Date(race.startTime)).code;

      if (tableCategoryCode !== null) {
        if (tableCategoryCode !== runnerCategoryCode) {
          return null;
        }
      }

      if (tableGender !== "mixed") {
        if (tableGender.toUpperCase() !== rankingRunner.gender.toUpperCase()) {
          return null;
        }
      }

      return (
        <ResponsiveRankingTableRow
          key={rankingRunner.id}
          race={race}
          runner={rankingRunner}
          tableCategoryCode={tableCategoryCode}
          tableGender={tableGender}
          showLastPassageTime={showLastPassageTime}
          formatGapMode={formatGapMode}
          showRunnerStoppedBadges={showRunnerStoppedBadges}
        />
      );
    },
    [formatGapMode, getCategory, race, showLastPassageTime, showRunnerStoppedBadges, tableCategoryCode, tableGender],
  );

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
      <tbody>{ranking.map((runner) => getRankingTableRow(runner))}</tbody>
    </Table>
  );
}
