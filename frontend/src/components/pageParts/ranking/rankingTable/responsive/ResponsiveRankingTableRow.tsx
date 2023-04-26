import {useMemo} from "react";
import {Link} from "react-router-dom";
import {formatFloatNumber, formatMsAsDuration} from "../../../../../util/utils";

interface ResponsiveRankingTableRowProps {
    runner: ProcessedRankingRunner;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
}

export default function ResponsiveRankingTableRow({
    runner,
    tableCategory,
    tableGender,
}: ResponsiveRankingTableRowProps) {
    const rowRanking = useMemo(() => {
        if (tableCategory === null) {
            if (tableGender === "mixed") {
                return runner.rankings.displayed.scratchMixed;
            }

            return runner.rankings.displayed.scratchGender;
        }

        if (tableGender === "mixed") {
            return runner.rankings.displayed.categoryMixed;
        }

        return runner.rankings.displayed.categoryGender;
    }, [runner, tableCategory, tableGender]);

    const rowSecondaryRankings = useMemo(() => {
        if (tableCategory === null) {
            if (tableGender === "mixed") {
                return (
                    <>
                        {runner.rankings.displayed.scratchGender} {runner.gender.toUpperCase()}
                        &nbsp;|&nbsp;
                        {runner.rankings.displayed.categoryMixed} {runner.category.toUpperCase()}
                        &nbsp;|&nbsp;
                        {runner.rankings.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}
                    </>
                );
            }

            return (
                <>
                    {runner.rankings.displayed.scratchMixed}
                    &nbsp;|&nbsp;
                    {runner.rankings.displayed.categoryMixed} {runner.category.toUpperCase()}
                    &nbsp;|&nbsp;
                    {runner.rankings.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}
                </>
            );
        }

        if (tableGender === "mixed") {
            return (
                <>
                    {runner.rankings.displayed.scratchMixed}
                    &nbsp;|&nbsp;
                    {runner.rankings.displayed.scratchGender} {runner.gender.toUpperCase()}
                    &nbsp;|&nbsp;
                    {runner.rankings.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}
                </>
            );
        }

        return (
            <>
                {runner.rankings.displayed.scratchMixed}
                &nbsp;|&nbsp;
                {runner.rankings.displayed.scratchGender} {runner.gender.toUpperCase()}
                &nbsp;|&nbsp;
                {runner.rankings.displayed.categoryMixed} {runner.category.toUpperCase()}
            </>
        );
    }, [runner, tableCategory, tableGender]);

    return (
        <tr>
            <td><strong>{rowRanking}</strong></td>
            <td style={{width: "100%"}}>
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
                            if (runner.lastPassageRaceTime === null) {
                                return null;
                            } else {
                                return (
                                    <>
                                        &nbsp;–&nbsp;
                                        Dernier passage {formatMsAsDuration(runner.lastPassageRaceTime)}
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
