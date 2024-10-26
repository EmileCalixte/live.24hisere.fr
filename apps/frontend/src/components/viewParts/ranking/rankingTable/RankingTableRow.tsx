import React from "react";
import { Link } from "react-router-dom";
import {
    type CategoryShortCode,
    type GenderWithMixed,
    type PublicRace,
} from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../../constants/misc";
import { type RankingRunner } from "../../../../types/Ranking";
import { getRankingType } from "../../../../utils/rankingUtils";
import { formatGap } from "../../../../utils/runnerUtils";
import { formatFloatNumber, formatMsAsDuration } from "../../../../utils/utils";
import RankingTableRowNCells from "./RankingTableRowNCells";
import RankingTableRunnerStoppedBadge from "./RankingTableRunnerStoppedBadge";

interface RankingTableRowProps {
    race: PublicRace;
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
            <RankingTableRowNCells
                runner={runner}
                tableCategory={tableCategory}
                tableGender={tableGender}
            />
            <td>{runner.id}</td>
            <td>
                {runner.lastname.toUpperCase()} {runner.firstname}
                {runner.stopped && <RankingTableRunnerStoppedBadge />}
            </td>
            <td>
                {raceInitialDistance > 0
                    ? Math.max(0, runner.passages.length - 1)
                    : runner.passages.length}
            </td>
            <td>{formatFloatNumber(runner.distance / 1000, 2)} km</td>
            <td>
                {(() => {
                    if (runner.lastPassageTime === null) {
                        return NO_VALUE_PLACEHOLDER;
                    } else {
                        return formatMsAsDuration(
                            runner.lastPassageTime.raceTime,
                        );
                    }
                })()}
            </td>
            <td>
                {(() => {
                    if (runner.averageSpeed === null) {
                        return NO_VALUE_PLACEHOLDER;
                    } else {
                        return (
                            <>
                                {formatFloatNumber(runner.averageSpeed, 2)} km/h
                            </>
                        );
                    }
                })()}
            </td>
            <td>
                {formatGap(
                    runner.gaps.firstRunner[
                        getRankingType(tableCategory, tableGender)
                    ].gap,
                ) ?? NO_VALUE_PLACEHOLDER}
            </td>

            <td className="hide-on-print">
                <Link to={`/runner-details/${runner.id}`}>Détails</Link>
            </td>
        </tr>
    );
}
