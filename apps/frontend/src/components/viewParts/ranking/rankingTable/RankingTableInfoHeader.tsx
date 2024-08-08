import React from "react";
import { Gender, GENDER_MIXED } from "../../../../constants/gender";
import { type CategoryShortCode } from "../../../../types/Category";
import { type GenderWithMixed } from "../../../../types/Gender";
import { type Race } from "../../../../types/Race";
import { formatMsAsDuration } from "../../../../utils/utils";

interface RankingTableInfoHeaderProps {
    race: Race;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
    tableRaceDuration: number | null;
}

export default function RankingTableInfoHeader({
    race,
    tableCategory,
    tableGender,
    tableRaceDuration,
}: RankingTableInfoHeaderProps): React.ReactElement {
    return (
        <td colSpan={42} className="ranking-table-info-header">
            {race.name} : Classement{" "}
            {(() => {
                if (tableCategory === null) {
                    return "scratch";
                } else {
                    return tableCategory.toUpperCase();
                }
            })()}{" "}
            {(() => {
                if (tableGender === GENDER_MIXED) {
                    return "mixte";
                } else if (tableGender === Gender.M) {
                    return "hommes";
                } else if (tableGender === Gender.F) {
                    return "femmes";
                } else {
                    return tableGender;
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
