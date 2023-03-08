import {type FunctionComponent} from "react";
import {type CategoryShortCode} from "../../../types/Category";
import {type Race} from "../../../types/Race";
import {Gender, type GenderWithMixed} from "../../../types/Runner";
import {formatMsAsDuration} from "../../../util/utils";

interface RankingTableInfoHeaderProps {
    race: Race;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
    tableRaceDuration: number | null;
}

const RankingTableInfoHeader: FunctionComponent<RankingTableInfoHeaderProps> = ({
    race,
    tableCategory,
    tableGender,
    tableRaceDuration,
}) => {
    return (
        <td colSpan={42} className="ranking-table-info-header">
            {race.name} : Classement {(() => {
                if (tableCategory === null) {
                    return "scratch";
                } else {
                    return tableCategory.toUpperCase();
                }
            })()} {(() => {
                if (tableGender === "mixed") {
                    return "mixte";
                } else if (tableGender === Gender.M) {
                    return "hommes";
                } else if (tableGender === Gender.F) {
                    return "femmes";
                } else {
                    return tableGender;
                }
            })()} {(() => {
                if (tableRaceDuration !== null) {
                    return `à ${formatMsAsDuration(tableRaceDuration)} de course`;
                }
            })()}
        </td>
    );
};

export default RankingTableInfoHeader;
