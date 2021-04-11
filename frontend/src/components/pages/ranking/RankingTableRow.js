import React from "react";
import {Link} from "react-router-dom";
import Ranking from "./Ranking";
import Util from "../../../util/Util";

class RankingTableRow extends React.Component {
    renderRankingsCell = () => {
        const runner = this.props.runner;
        const rankingTableCategory = this.props.category;
        const rankingTableGender = this.props.gender;

        if (rankingTableCategory === Ranking.CATEGORY_TEAM) {
            return (
                <td>
                    {runner.rankings.displayed.scratchMixed}
                </td>
            );
        } else if (rankingTableCategory === Ranking.CATEGORY_ALL) {
            if (rankingTableGender === Ranking.GENDER_MIXED) {
                return (
                    <>
                        <td>
                            <strong>{runner.rankings.displayed.scratchMixed}</strong>
                        </td>
                        <td>
                            {runner.rankings.displayed.scratchGender} {runner.gender.toUpperCase()}
                        </td>
                        <td>
                            {runner.rankings.displayed.categoryMixed} {runner.category.toUpperCase()}
                        </td>
                        <td>
                            {runner.rankings.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}
                        </td>
                    </>
                );
            } else {
                return (
                    <>
                        <td>
                            <strong>{runner.rankings.displayed.scratchGender} {runner.gender.toUpperCase()}</strong>
                        </td>
                        <td>
                            {runner.rankings.displayed.scratchMixed}
                        </td>
                        <td>
                            {runner.rankings.displayed.categoryMixed} {runner.category.toUpperCase()}
                        </td>
                        <td>
                            {runner.rankings.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}
                        </td>
                    </>
                );
            }
        } else {
            if (rankingTableGender === Ranking.GENDER_MIXED) {
                return (
                    <>
                        <td>
                            <strong>{runner.rankings.displayed.categoryMixed} {runner.category.toUpperCase()}</strong>
                        </td>
                        <td>
                            {runner.rankings.displayed.scratchMixed}
                        </td>
                        <td>
                            {runner.rankings.displayed.scratchGender} {runner.gender.toUpperCase()}
                        </td>
                        <td>
                            {runner.rankings.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}
                        </td>
                    </>
                );
            } else {
                return (
                    <>
                        <td>
                            <strong>{runner.rankings.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}</strong>
                        </td>
                        <td>
                            {runner.rankings.displayed.scratchMixed}
                        </td>
                        <td>
                            {runner.rankings.displayed.scratchGender} {runner.gender.toUpperCase()}
                        </td>
                        <td>
                            {runner.rankings.displayed.categoryMixed} {runner.category.toUpperCase()}
                        </td>
                    </>
                );
            }
        }
    }

    render = () => {
        const runner = this.props.runner;
        const rankingTableCategory = this.props.category;
        const rankingTableGender = this.props.gender;

        return (
            <tr>
                {this.renderRankingsCell()}

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
                <td>{Util.formatFloatNumber(runner.distance / 1000, 2)} km</td>
                <td>{runner.lastPassageTime} (TODO)</td>
                <td>VMOY</td>

                <td>
                    <Link to={`/runner-details?id=${runner.id}`}>Détails</Link>
                </td>
            </tr>
        )
    }
}

export default RankingTableRow;
