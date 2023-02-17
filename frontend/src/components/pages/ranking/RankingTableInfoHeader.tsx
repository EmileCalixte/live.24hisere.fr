import React from "react";
import {CategoryShortCode} from "../../../types/Category";
import {Race} from "../../../types/Race";
import {Gender, GenderWithMixed} from "../../../types/Runner";
import Util from "../../../util/Util";

const RankingTableInfoHeader: React.FunctionComponent<{
    race: Race
    tableCategory: CategoryShortCode | null,
    tableGender: GenderWithMixed,
    tableRaceDuration: number | null,
}> = ({race, tableCategory, tableGender, tableRaceDuration}) => {
    return (
        <td colSpan={42} className="ranking-table-info-header">
            {race.name} : Classement {(() => {
            if (tableCategory === null) {
                return 'scratch';
            } else {
                return tableCategory.toUpperCase();
            }
        })()} {(() => {
            if (tableGender === "mixed") {
                return 'mixte';
            } else if (tableGender === Gender.M) {
                return 'hommes';
            } else if (tableGender === Gender.F) {
                return 'femmes';
            } else {
                return tableGender;
            }
        })()} {(() => {
            if (tableRaceDuration !== null) {
                return `à ${Util.formatMsAsDuration(tableRaceDuration)} de course`;
            }
        })()}
        </td>
    )
}

export default RankingTableInfoHeader;
