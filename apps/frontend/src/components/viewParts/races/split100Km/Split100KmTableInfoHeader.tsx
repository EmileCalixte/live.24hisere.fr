import React from "react";
import { GENDER } from "@live24hisere/core/constants";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { appDataContext } from "../../../../contexts/AppDataContext";
import { isRaceFinished } from "../../../../utils/raceUtils";
import { TABLE_HEADER_BG_CLASSNAME, Td } from "../../../ui/Table";
import RaceTimer from "../../RaceTimer";

interface Split100KmTableInfoHeaderProps {
  race: PublicRace;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
}

export default function Split100KmTableInfoHeader({
  race,
  tableCategoryCode,
  tableGender,
}: Split100KmTableInfoHeaderProps): React.ReactElement {
  const { serverTimeOffset } = React.useContext(appDataContext);

  return (
    <Td colSpan={42} className={TABLE_HEADER_BG_CLASSNAME}>
      {race.name} : Passage aux 100 km{" "}
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
      {!isRaceFinished(race, serverTimeOffset) && (
        <>
          –{" "}
          <strong>
            <RaceTimer race={race} />
          </strong>
        </>
      )}
    </Td>
  );
}
