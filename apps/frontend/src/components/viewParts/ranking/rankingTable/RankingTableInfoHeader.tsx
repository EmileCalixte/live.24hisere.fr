import React from "react";
import { GENDER } from "@live24hisere/core/constants";
import {
    type CategoryShortCode,
    type GenderWithMixed,
    type PublicRace,
} from "@live24hisere/core/types";
import { formatMsAsDuration } from "../../../../utils/utils";

interface RankingTableInfoHeaderProps {
    race: PublicRace;
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
                if (tableGender === "mixed") {
                    return "mixte";
                } else if (tableGender === GENDER.M) {
                    return "hommes";
                } else if (tableGender === GENDER.F) {
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
