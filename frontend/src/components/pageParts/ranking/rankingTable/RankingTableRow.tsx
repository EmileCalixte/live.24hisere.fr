import { Link } from "react-router-dom";
import { type CategoryShortCode } from "../../../../types/Category";
import { type GenderWithMixed } from "../../../../types/Gender";
import { type Race } from "../../../../types/Race";
import { type ProcessedRankingRunner } from "../../../../types/Ranking";
import { formatFloatNumber, formatMsAsDuration } from "../../../../util/utils";
import RankingTableRowNCells from "./RankingTableRowNCells";

interface RankingTableRowProps {
    race: Race;
    runner: ProcessedRankingRunner;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
}

export default function RankingTableRow({
    race,
    runner,
    tableCategory,
    tableGender,
}: RankingTableRowProps): JSX.Element {
    const raceInitialDistance = Number(race.initialDistance);

    return (
        <tr>
            <RankingTableRowNCells runner={runner} tableCategory={tableCategory} tableGender={tableGender} />
            <td>{runner.id}</td>
            <td>{runner.lastname.toUpperCase()} {runner.firstname}</td>
            <td>{raceInitialDistance > 0 ? Math.max(0, runner.passageCount - 1) : runner.passageCount}</td>
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
}
