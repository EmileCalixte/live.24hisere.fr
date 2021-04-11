import React from "react";
import RankingTableRow from "./RankingTableRow";
import Ranking from "./Ranking";

class RankingTable extends React.Component {
    render = () => {
        return(
            <table id="ranking-table" className="table">
                <thead>
                <tr>
                    <td colSpan="42" className="ranking-table-print-header">
                        Classement {(() => {
                            if (this.props.category === Ranking.CATEGORY_TEAM) {
                                return 'équipes';
                            } else if (this.props.category === Ranking.CATEGORY_ALL) {
                                return 'scratch';
                            } else {
                                return this.props.category.toUpperCase();
                            }
                        })()} {(() => {
                            if (this.props.category === Ranking.CATEGORY_TEAM) {
                                return null;
                            }

                            if (this.props.gender === Ranking.GENDER_MIXED) {
                                return 'mixte';
                            } else if (this.props.gender === Ranking.GENDER_M) {
                                return 'hommes';
                            } else if (this.props.gender === Ranking.GENDER_F) {
                                return 'femmes';
                            } else {
                                return this.props.gender;
                            }
                        })()}
                    </td>
                </tr>
                <tr>
                    <th colSpan={this.props.category === Ranking.CATEGORY_TEAM ? 1 : 4}>N°</th>
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
                {this.renderRankingRows()}
                </tbody>
            </table>
        )
    }

    renderRankingRows = () => {
        return this.props.ranking.map((runner) => {
            if (this.props.category !== Ranking.CATEGORY_TEAM && runner.isTeam) {
                return null;
            } else if (this.props.category === Ranking.CATEGORY_TEAM && !runner.isTeam) {
                return null;
            } else if (this.props.category !== Ranking.CATEGORY_ALL && this.props.category !== Ranking.CATEGORY_TEAM) {
                if (this.props.category.toUpperCase() !== runner.category.toUpperCase()) {
                    return null;
                }
            }

            if (this.props.category !== Ranking.CATEGORY_TEAM) {
                if (this.props.gender !== Ranking.GENDER_MIXED) {
                    if (this.props.gender.toUpperCase() !== runner.gender.toUpperCase()) {
                        return null;
                    }
                }
            }

            return (
                <RankingTableRow
                    key={runner.id}
                    runner={runner}
                    category={this.props.category}
                    gender={this.props.gender}
                />
            );
        });
    }
}

export default RankingTable;
