import React from "react";
import RankingTableRow from "./RankingTableRow";
import Ranking from "./Ranking";

class RankingTable extends React.Component {
    render = () => {
        return(
            <table id="ranking-table" className="table">
                <thead>
                <tr>
                    <th>N°</th>
                    {(() => {
                        if (this.props.category === Ranking.CATEGORY_TEAM) {
                            return null;
                        }

                        if (this.props.category === Ranking.CATEGORY_ALL) {
                            return (
                                <th>N° Cat.</th>
                            )
                        }

                        return (
                            <th>N° Scratch</th>
                        )
                    })()}
                    <th>Doss.</th>
                    <th>Nom</th>
                    <th>Nb. tours</th>
                    <th>Distance</th>
                    <th>Dernier passage</th>
                    <th>Vitesse moy.</th>
                    <th>Détails</th>
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
