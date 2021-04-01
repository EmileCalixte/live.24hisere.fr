import React from "react";
import {Link} from "react-router-dom";
import Util from "../../../util/Util";

class RankingTableRow extends React.Component {
    render = () => {
        // TODO display some rows only if a category or a gender is selected
        // TODO specific format for teams ranking

        return (
            <tr>
                <td>{this.props.displayedRanking}</td>
                <td>{this.props.id}</td>
                <td>{this.props.gender.toUpperCase()}</td>
                <td>{this.props.category.toUpperCase()}</td>
                <td>{this.props.lastname.toUpperCase()} {this.props.firstname}</td>
                <td>{this.props.lapCount}</td>
                <td>{Util.formatFloatNumber(this.props.distance / 1000, 2)} {this.props.distanceMetric}</td>
                <td>{this.props.lastPassageTime}</td>
                <td>{Util.formatFloatNumber(this.props.averageSpeed, 2)} {this.props.averageSpeedMetric}</td>
                <td>
                    <Link to={`/runner-details?id=${this.props.id}`}>Détails</Link>
                </td>
            </tr>
        )
    }
}

export default RankingTableRow;
