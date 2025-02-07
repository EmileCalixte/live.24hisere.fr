import type React from "react";
import { type CategoryCode, getCategory } from "@emilecalixte/ffa-categories";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { Ranking, RankingRunner } from "../../../../types/Ranking";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import RankingTableRow from "./RankingTableRow";

interface RankingTableProps {
  race: PublicRace;
  ranking: Ranking;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
  tableRaceDuration: number | null;
  showLastPassageTime: boolean;
}

export default function RankingTable({
  race,
  ranking,
  tableCategoryCode,
  tableGender,
  tableRaceDuration,
  showLastPassageTime,
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
          <th>Nb. tours</th>
          <th>Distance</th>
          {showLastPassageTime && <th>Dernier passage</th>}
          <th>Vitesse moy.</th>
          <th>Écart 1er</th>
          <th className="hide-on-print">Détails</th>
        </tr>
      </thead>
      <tbody>{ranking.map((runner) => getRankingTableRow(runner))}</tbody>
    </table>
  );
}
