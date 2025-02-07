import React from "react";
import type { CategoryCode } from "@emilecalixte/ffa-categories";
import { GENDER } from "@live24hisere/core/constants";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { isRaceFinished } from "../../../../utils/raceUtils";
import { formatMsAsDuration } from "../../../../utils/utils";
import { appContext } from "../../../App";
import RaceTimer from "../../RaceTimer";

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
  const { serverTimeOffset } = React.useContext(appContext).appData;

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
        } else if (!isRaceFinished(race, serverTimeOffset)) {
          return (
            <>
              –{" "}
              <strong>
                <RaceTimer race={race} />
              </strong>
            </>
          );
        }
      })()}
    </td>
  );
}
