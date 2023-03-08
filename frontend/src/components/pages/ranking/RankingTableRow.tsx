import {Link} from "react-router-dom";
import {type CategoryShortCode} from "../../../types/Category";
import {formatFloatNumber, formatMsAsDuration} from "../../../util/utils";
import RankingTableRowNCells from "./RankingTableRowNCells";
import {type FunctionComponent} from "react";
import {type ProcessedRankingRunner} from "../../../types/Ranking";
import {type GenderWithMixed} from "../../../types/Runner";

interface RankingTableRowProps {
    runner: ProcessedRankingRunner;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
}

const RankingTableRow: FunctionComponent<RankingTableRowProps> = ({
    runner,
    tableCategory,
    tableGender,
}) => {
    return (
        <tr>
            <RankingTableRowNCells runner={runner} tableCategory={tableCategory} tableGender={tableGender} />
            <td>{runner.id}</td>
            <td>{runner.lastname.toUpperCase()} {runner.firstname}</td>
            <td>{Math.max(0, runner.passageCount - 1)}</td>
            <td>{formatFloatNumber(runner.distance / 1000, 2)} km</td>
            <td>
                {(() => {
                    if (runner.lastPassageRaceTime === null) {
                        return "n/a";
                    } else {
                        return formatMsAsDuration(runner.lastPassageRaceTime);
                    }
                })()}
            </td>
            <td>
                {(() => {
                    if (runner.averageSpeed === null) {
                        return "n/a";
                    } else {
                        return (
                            <>
                                {formatFloatNumber(runner.averageSpeed, 2)} km/h
                            </>
                        );
                    }
                })()}
            </td>

            <td className="hide-on-print">
                <Link to={`/runner-details/${runner.id}`}>Détails</Link>
            </td>
        </tr>
    );
};

export default RankingTableRow;
