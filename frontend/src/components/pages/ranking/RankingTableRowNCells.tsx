import {CategoryShortCode} from "../../../types/Category";
import React from "react";
import {ProcessedRankingRunner} from "../../../types/Ranking";
import {GenderWithMixed} from "../../../types/Runner";

const RankingTableRowNCells: React.FunctionComponent<{
    runner: ProcessedRankingRunner,
    tableCategory: CategoryShortCode | null,
    tableGender: GenderWithMixed,
}> = ({runner, tableCategory, tableGender}) => {
     if (tableCategory === null) {
        if (tableGender === "mixed") {
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
        if (tableGender === "mixed") {
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
};

export default RankingTableRowNCells;
