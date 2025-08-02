import React from "react";
import { GENDER } from "@live24hisere/core/constants";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { appContext } from "../../../../contexts/AppContext";
import { formatMsAsDuration } from "../../../../utils/durationUtils";
import { isRaceFinished } from "../../../../utils/raceUtils";
import { TABLE_HEADER_BG_CLASSNAME, Td } from "../../../ui/Table";
import RaceTimer from "../../RaceTimer";

interface RankingTableInfoHeaderProps {
  race: PublicRace;
  tableCategoryCode: string | null;
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
    <Td colSpan={42} className={TABLE_HEADER_BG_CLASSNAME}>
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
    </Td>
  );
}
