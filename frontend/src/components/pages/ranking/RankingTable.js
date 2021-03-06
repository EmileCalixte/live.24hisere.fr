import RankingTableRow from "./RankingTableRow";
import {CATEGORY_ALL, CATEGORY_TEAM, GENDER_F, GENDER_M, GENDER_MIXED} from "./Ranking";
import Util from "../../../util/Util";

const RankingTable = ({ranking, tableCategory, tableGender, tableRaceDuration}) => {
    const getRankingTableRow = (rankingRunner) => {
        if (tableCategory !== CATEGORY_TEAM && rankingRunner.isTeam) {
            return null;
        } else if (tableCategory === CATEGORY_TEAM && !rankingRunner.isTeam) {
            return null;
        } else if (tableCategory !== CATEGORY_ALL && tableCategory !== CATEGORY_TEAM) {
            if (tableCategory.toUpperCase() !== rankingRunner.category.toUpperCase()) {
                return null;
            }
        }

        if (tableCategory !== CATEGORY_TEAM) {
            if (tableGender !== GENDER_MIXED) {
                if (tableGender.toUpperCase() !== rankingRunner.gender.toUpperCase()) {
                    return null;
                }
            }
        }

        return (
            <RankingTableRow key={rankingRunner.id}
                             runner={rankingRunner}
                             tableCategory={tableCategory}
                             tableGender={tableGender}
            />
        );
    }

    return (
        <table id="ranking-table" className="table">
            <thead>
            <tr>
                <td colSpan="42" className="ranking-table-info-header">
                    Classement {(() => {
                        if (tableCategory === CATEGORY_TEAM) {
                            return 'équipes';
                        } else if (tableCategory === CATEGORY_ALL) {
                            return 'scratch';
                        } else {
                            return tableCategory.toUpperCase();
                        }
                    })()} {(() => {
                        if (tableCategory === CATEGORY_TEAM) {
                            return null;
                        }

                        if (tableGender === GENDER_MIXED) {
                            return 'mixte';
                        } else if (tableGender === GENDER_M) {
                            return 'hommes';
                        } else if (tableGender === GENDER_F) {
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
            </tr>
            <tr>
                <th colSpan={tableCategory === CATEGORY_TEAM ? 1 : 4}>N°</th>
                <th>Doss.</th>
                <th>Nom</th>
                <th>Nb. tours</th>
                <th>Distance</th>
                <th>Dernier passage</th>
                <th>Vitesse moy.</th>
                <th className="hide-on-print">Détails</th>
            </tr>
            </thead>
            <tbody>
            {ranking.map((runner) => getRankingTableRow(runner))}
            </tbody>
        </table>
    );
}

export default RankingTable;
