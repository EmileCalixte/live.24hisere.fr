import {Link} from "react-router-dom";
import {CATEGORY_TEAM} from "./Ranking";
import Util from "../../../util/Util";
import RankingTableRowNCells from "./RankingTableRowNCells";

const RankingTableRow = ({runner, tableCategory, tableGender}) => {
    return (
        <tr>
            <RankingTableRowNCells runner={runner} tableCategory={tableCategory} tableGender={tableGender} />

            <td>{runner.id}</td>

            {(() => {
                if (tableCategory === CATEGORY_TEAM) {
                    return (
                        <td>{runner.firstname}</td>
                    )
                }

                return (
                    <td>{runner.lastname.toUpperCase()} {runner.firstname}</td>
                )
            })()}

            <td>{Math.max(0, runner.passageCount - 1)}</td>
            <td>{Util.formatFloatNumber(runner.distance / 1000, 2)} km</td>
            <td>
                {(() => {
                    if (runner.lastPassageRaceTime === null) {
                        return 'n/a';
                    } else {
                        return Util.formatMsAsDuration(runner.lastPassageRaceTime);
                    }
                })()}
            </td>
            <td>
                {(() => {
                    if (runner.averageSpeed === null) {
                        return 'n/a';
                    } else {
                        return (
                            <>
                                {Util.formatFloatNumber(runner.averageSpeed, 2)} km/h
                            </>
                        )
                    }
                })()}
            </td>

            <td className="hide-on-print">
                <Link to={`/runner-details?id=${runner.id}`}>Détails</Link>
            </td>
        </tr>
    );
}

export default RankingTableRow;
