import React from "react";
import { Link } from "react-router-dom";
import { type CategoryShortCode } from "../../../../types/Category";
import { type GenderWithMixed } from "../../../../types/Gender";
import { type Race } from "../../../../types/Race";
import { type RankingRunner } from "../../../../types/Ranking";
import { formatFloatNumber, formatMsAsDuration } from "../../../../utils/utils";
import RankingTableRowNCells from "./RankingTableRowNCells";

interface RankingTableRowProps {
    race: Race;
    runner: RankingRunner;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
}

export default function RankingTableRow({
    race,
    runner,
    tableCategory,
    tableGender,
}: RankingTableRowProps): React.ReactElement {
    const raceInitialDistance = Number(race.initialDistance);

    return (
        <tr>
            <RankingTableRowNCells runner={runner} tableCategory={tableCategory} tableGender={tableGender} />
            <td>{runner.id}</td>
            <td>{runner.lastname.toUpperCase()} {runner.firstname}</td>
            <td>{raceInitialDistance > 0 ? Math.max(0, runner.passages.length - 1) : runner.passages.length}</td>
            <td>{formatFloatNumber(runner.distance / 1000, 2)} km</td>
            <td>
                {(() => {
                    if (runner.lastPassageTime === null) {
                        return "n/a";
                    } else {
                        return formatMsAsDuration(runner.lastPassageTime.raceTime);
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
