import type React from "react";
import { type CategoryCode, getCategory } from "@emilecalixte/ffa-categories";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { Ranking, RankingRunner } from "../../../../types/Ranking";
import type { FormatGapMode } from "../../../../utils/runnerUtils";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import RankingTableRow from "./RankingTableRow";

interface RankingTableProps {
  race: PublicRace;
  ranking: Ranking;
  tableCategoryCode: CategoryCode | null;
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
  const getRankingTableRow = (rankingRunner: RankingRunner): React.ReactElement | null => {
    const runnerCategory = getCategory(Number(rankingRunner.birthYear), { date: new Date(race.startTime) }).code;

    if (tableCategoryCode !== null) {
      if (tableCategoryCode !== runnerCategory) {
        return null;
      }
    }

    if (tableGender !== "mixed") {
      if (tableGender.toUpperCase() !== rankingRunner.gender.toUpperCase()) {
        return null;
      }
    }

    return (
      <RankingTableRow
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
  };

  return (
    <table id="ranking-table" className="table">
      <thead>
        <tr>
          <RankingTableInfoHeader
            race={race}
            tableCategoryCode={tableCategoryCode}
            tableGender={tableGender}
            tableRaceDuration={tableRaceDuration}
          />
        </tr>
        <tr>
          <th colSpan={4}>Classement</th>
          <th>Doss.</th>
          <th>Nom</th>
          {!race.isBasicRanking && <th>Nb. tours</th>}
          <th>Distance</th>
          {showLastPassageTime && <th>Dernier passage</th>}
          <th>Vitesse moy.</th>
          {!race.isBasicRanking && <th>Écart 1er</th>}
          <th className="hide-on-print">Détails</th>
        </tr>
      </thead>
      <tbody>{ranking.map((runner) => getRankingTableRow(runner))}</tbody>
    </table>
  );
}
