import React from "react";
import {
    type CategoryShortCode,
    type GenderWithMixed,
    type PublicRace,
} from "@live24hisere/types";
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
                } else if (tableGender === "M") {
                    return "hommes";
                } else if (tableGender === "F") {
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
