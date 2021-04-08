import React from "react";
import {Link} from "react-router-dom";
import Ranking from "./Ranking";

class RankingTableRow extends React.Component {
    render = () => {
        const runner = this.props.runner;
        const rankingTableCategory = this.props.category;
        const rankingTableGender = this.props.gender;

        console.log('RENDER', this.props.runner);

        return (
            <tr>
                <td>{runner.displayedScratchRanking}</td>

                {(() => {
                    if (rankingTableCategory === Ranking.CATEGORY_TEAM) {
                        return null;
                    }

                    if (rankingTableCategory === Ranking.CATEGORY_ALL) {
                        return (
                            <td>
                                {runner.displayedCategoryRanking} {runner.category.toUpperCase()}
                                &nbsp;–&nbsp;
                                {runner.displayedGenderRanking} {runner.gender.toUpperCase()}
                            </td>
                        )
                    }

                    return (
                        <td>
                            {runner.displayedScratchRanking}
                            &nbsp;–&nbsp;
                            {runner.displayedGenderRanking} {runner.gender.toUpperCase()}
                        </td>
                    )
                })()}

                <td>{runner.id}</td>

                {(() => {
                    if (rankingTableCategory === Ranking.CATEGORY_TEAM) {
                        return (
                            <td>{this.props.runner.firstname}</td>
                        )
                    }

                    return (
                        <td>{this.props.runner.lastname.toUpperCase()} {this.props.runner.firstname}</td>
                    )
                })()}

                <td>{Math.max(0, this.props.runner.passageCount - 1)}</td>
                <td>DISTANCE</td>
                <td>DERNIER PASSAGE</td>
                <td>VMOY</td>

                <td>
                    <Link to={`/runner-details?id=${runner.id}`}>Détails</Link>
                </td>
            </tr>
        )
    }
}

export default RankingTableRow;
