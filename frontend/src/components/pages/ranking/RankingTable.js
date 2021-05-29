import RankingTableRow from "./RankingTableRow";
import {CATEGORY_ALL, CATEGORY_TEAM, GENDER_F, GENDER_M, GENDER_MIXED} from "./Ranking";

const RankingTable = ({ranking, tableCategory, tableGender}) => {
    return(
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
            {ranking.map((runner) => {
                if (tableCategory !== CATEGORY_TEAM && runner.isTeam) {
                    return null;
                } else if (tableCategory === CATEGORY_TEAM && !runner.isTeam) {
                    return null;
                } else if (tableCategory !== CATEGORY_ALL && tableCategory !== CATEGORY_TEAM) {
                    if (tableCategory.toUpperCase() !== runner.category.toUpperCase()) {
                        return null;
                    }
                }

                if (tableCategory !== CATEGORY_TEAM) {
                    if (tableGender !== GENDER_MIXED) {
                        if (tableGender.toUpperCase() !== runner.gender.toUpperCase()) {
                            return null;
                        }
                    }
                }

                return (
                    <RankingTableRow
                        key={runner.id}
                        runner={runner}
                        tableCategory={tableCategory}
                        tableGender={tableGender}
                    />
                );
            })}
            </tbody>
        </table>
    );
}

export default RankingTable;
