import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { GENDER_MIXED } from "../../../../../constants/gender";
import { type CategoryShortCode } from "../../../../../types/Category";
import { type GenderWithMixed } from "../../../../../types/Gender";
import { type RankingRunner } from "../../../../../types/Ranking";
import { getCategoryCodeFromBirthYear } from "../../../../../utils/ffaUtils";
import { formatFloatNumber, formatMsAsDuration } from "../../../../../utils/utils";

interface ResponsiveRankingTableRowProps {
    runner: RankingRunner;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
}

export default function ResponsiveRankingTableRow({
    runner,
    tableCategory,
    tableGender,
}: ResponsiveRankingTableRowProps): React.ReactElement {
    const runnerCategory = getCategoryCodeFromBirthYear(runner.birthYear);

    const rowRanking = useMemo(() => {
        if (tableCategory === null) {
            if (tableGender === GENDER_MIXED) {
                return runner.ranks.displayed.scratchMixed;
            }

            return runner.ranks.displayed.scratchGender;
        }

        if (tableGender === GENDER_MIXED) {
            return runner.ranks.displayed.categoryMixed;
        }

        return runner.ranks.displayed.categoryGender;
    }, [runner, tableCategory, tableGender]);

    const rowSecondaryRankings = useMemo(() => {
        if (tableCategory === null) {
            if (tableGender === GENDER_MIXED) {
                return (
                    <>
                        {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
                        &nbsp;|&nbsp;
                        {runner.ranks.displayed.categoryMixed} {runnerCategory}
                        &nbsp;|&nbsp;
                        {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
                    </>
                );
            }

            return (
                <>
                    {runner.ranks.displayed.scratchMixed}
                    &nbsp;|&nbsp;
                    {runner.ranks.displayed.categoryMixed} {runnerCategory}
                    &nbsp;|&nbsp;
                    {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
                </>
            );
        }

        if (tableGender === GENDER_MIXED) {
            return (
                <>
                    {runner.ranks.displayed.scratchMixed}
                    &nbsp;|&nbsp;
                    {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
                    &nbsp;|&nbsp;
                    {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
                </>
            );
        }

        return (
            <>
                {runner.ranks.displayed.scratchMixed}
                &nbsp;|&nbsp;
                {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
                &nbsp;|&nbsp;
                {runner.ranks.displayed.categoryMixed} {runnerCategory}
            </>
        );
    }, [runner, tableCategory, tableGender, runnerCategory]);

    return (
        <tr>
            <td><strong>{rowRanking}</strong></td>
            <td style={{ width: "100%" }}>
                <Link to={`/runner-details/${runner.id}`}>
                    <div>
                        <strong>{runner.lastname.toUpperCase()} {runner.firstname} – N°{runner.id}</strong>
                    </div>

                    <div className="responsive-ranking-table-row-secondary-rankings">
                        {rowSecondaryRankings}
                    </div>

                    <div className="responsive-ranking-table-row-stats">
                        {formatFloatNumber(runner.distance / 1000, 2)} km

                        {(() => {
                            if (runner.averageSpeed === null) {
                                return null;
                            } else {
                                return (
                                    <>
                                        &nbsp;–&nbsp;
                                        {formatFloatNumber(runner.averageSpeed, 2)} km/h moy.
                                    </>
                                );
                            }
                        })()}

                        {(() => {
                            if (runner.lastPassageTime === null) {
                                return null;
                            } else {
                                return (
                                    <>
                                        &nbsp;–&nbsp;
                                        Dernier passage {formatMsAsDuration(runner.lastPassageTime.raceTime)}
                                    </>
                                );
                            }
                        })()}
                    </div>
                </Link>
            </td>
        </tr>
    );
}
