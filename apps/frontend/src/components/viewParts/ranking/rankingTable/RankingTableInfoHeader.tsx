import React from "react";
import { type CategoryCode } from "@emilecalixte/ffa-categories";
import { GENDER } from "@live24hisere/core/constants";
import { type GenderWithMixed, type PublicRace } from "@live24hisere/core/types";
import { formatMsAsDuration } from "../../../../utils/utils";

interface RankingTableInfoHeaderProps {
  race: PublicRace;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
  tableRaceDuration: number | null;
}

export default function RankingTableInfoHeader({
  race,
  tableCategoryCode,
  tableGender,
  tableRaceDuration,
}: RankingTableInfoHeaderProps): React.ReactElement {
  return (
    <td colSpan={42} className="ranking-table-info-header">
      {race.name} : Classement{" "}
      {(() => {
        if (tableCategoryCode === null) {
          return "scratch";
        } else {
          return tableCategoryCode.toUpperCase();
        }
      })()}{" "}
      {(() => {
        if (tableGender === GENDER.M) {
          return "hommes";
        } else if (tableGender === GENDER.F) {
          return "femmes";
        } else {
          return "mixte";
        }
      })()}{" "}
      {(() => {
        if (tableRaceDuration !== null) {
          return `à ${formatMsAsDuration(tableRaceDuration)} de course`;
        }
      })()}
    </td>
  );
}
