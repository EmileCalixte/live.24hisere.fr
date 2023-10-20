import React from "react";
import { GENDER_MIXED } from "../../../../constants/gender";
import { type CategoryShortCode } from "../../../../types/Category";
import { type GenderWithMixed } from "../../../../types/Gender";
import { type RankingRunner } from "../../../../types/Ranking";
import { getCategoryCodeFromBirthYear } from "../../../../utils/ffaUtils";

interface RankingTableRowNCellsProps {
    runner: RankingRunner;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
}

export default function RankingTableRowNCells({
    runner,
    tableCategory,
    tableGender,
}: RankingTableRowNCellsProps): React.ReactElement {
    const runnerCategory = getCategoryCodeFromBirthYear(runner.birthYear);

    if (tableCategory === null) {
        if (tableGender === GENDER_MIXED) {
            return (
                <>
                    <td>
                        <strong>{runner.ranks.displayed.scratchMixed}</strong>
                    </td>
                    <td>
                        {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
                    </td>
                    <td>
                        {runner.ranks.displayed.categoryMixed} {runnerCategory}
                    </td>
                    <td>
                        {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
                    </td>
                </>
            );
        } else {
            return (
                <>
                    <td>
                        <strong>{runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}</strong>
                    </td>
                    <td>
                        {runner.ranks.displayed.scratchMixed}
                    </td>
                    <td>
                        {runner.ranks.displayed.categoryMixed} {runnerCategory}
                    </td>
                    <td>
                        {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
                    </td>
                </>
            );
        }
    } else {
        if (tableGender === GENDER_MIXED) {
            return (
                <>
                    <td>
                        <strong>{runner.ranks.displayed.categoryMixed} {runnerCategory}</strong>
                    </td>
                    <td>
                        {runner.ranks.displayed.scratchMixed}
                    </td>
                    <td>
                        {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
                    </td>
                    <td>
                        {runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}
                    </td>
                </>
            );
        } else {
            return (
                <>
                    <td>
                        <strong>{runner.ranks.displayed.categoryGender} {runnerCategory}-{runner.gender.toUpperCase()}</strong>
                    </td>
                    <td>
                        {runner.ranks.displayed.scratchMixed}
                    </td>
                    <td>
                        {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
                    </td>
                    <td>
                        {runner.ranks.displayed.categoryMixed} {runnerCategory}
                    </td>
                </>
            );
        }
    }
}
