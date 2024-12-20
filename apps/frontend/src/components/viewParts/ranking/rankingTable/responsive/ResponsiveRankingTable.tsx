import React, { useCallback } from "react";
import { type CategoryShortCode, type GenderWithMixed, type PublicRace } from "@live24hisere/core/types";
import { categoryUtils } from "@live24hisere/utils";
import { type Ranking, type RankingRunner } from "../../../../../types/Ranking";
import RankingTableInfoHeader from "../RankingTableInfoHeader";
import ResponsiveRankingTableRow from "./ResponsiveRankingTableRow";

interface ResponsiveRankingTableProps {
  race: PublicRace;
  ranking: Ranking;
  tableCategory: CategoryShortCode | null;
  tableGender: GenderWithMixed;
  tableRaceDuration: number | null;
}

export default function ResponsiveRankingTable({
  race,
  ranking,
  tableCategory,
  tableGender,
  tableRaceDuration,
}: ResponsiveRankingTableProps): React.ReactElement {
  const getRankingTableRow = useCallback(
    (rankingRunner: RankingRunner) => {
      const runnerCategory = categoryUtils.getCategoryCodeFromBirthYear(rankingRunner.birthYear);

      if (tableCategory !== null) {
        if (tableCategory !== runnerCategory) {
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
          runner={rankingRunner}
          tableCategory={tableCategory}
          tableGender={tableGender}
        />
      );
    },
    [tableCategory, tableGender],
  );

  return (
    <table id="ranking-table" className="table responsive-ranking-table">
      <thead>
        <tr>
          <RankingTableInfoHeader
            race={race}
            tableCategory={tableCategory}
            tableGender={tableGender}
            tableRaceDuration={tableRaceDuration}
          />
        </tr>
      </thead>
      <tbody>{ranking.map((runner) => getRankingTableRow(runner))}</tbody>
    </table>
  );
}
