import React from "react";
import { type CategoryCode, getCategory } from "@emilecalixte/ffa-categories";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { Ranking, RankingRunner } from "../../../../../types/Ranking";
import RankingTableInfoHeader from "../RankingTableInfoHeader";
import ResponsiveRankingTableRow from "./ResponsiveRankingTableRow";

interface ResponsiveRankingTableProps {
  race: PublicRace;
  ranking: Ranking;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
  tableRaceDuration: number | null;
  showLastPassageTime: boolean;
  formatGapWithOnlyLaps: boolean;
  showRunnerStoppedBadges: boolean;
}

export default function ResponsiveRankingTable({
  race,
  ranking,
  tableCategoryCode,
  tableGender,
  tableRaceDuration,
  showLastPassageTime,
  formatGapWithOnlyLaps,
  showRunnerStoppedBadges,
}: ResponsiveRankingTableProps): React.ReactElement {
  const getRankingTableRow = React.useCallback(
    (rankingRunner: RankingRunner) => {
      const runnerCategoryCode = getCategory(Number(rankingRunner.birthYear), { date: new Date(race.startTime) }).code;

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
          formatGapWithOnlyLaps={formatGapWithOnlyLaps}
          showRunnerStoppedBadges={showRunnerStoppedBadges}
        />
      );
    },
    [formatGapWithOnlyLaps, race, showLastPassageTime, showRunnerStoppedBadges, tableCategoryCode, tableGender],
  );

  return (
    <table id="ranking-table" className="table responsive-ranking-table">
      <thead>
        <tr>
          <RankingTableInfoHeader
            race={race}
            tableCategoryCode={tableCategoryCode}
            tableGender={tableGender}
            tableRaceDuration={tableRaceDuration}
          />
        </tr>
      </thead>
      <tbody>{ranking.map((runner) => getRankingTableRow(runner))}</tbody>
    </table>
  );
}
