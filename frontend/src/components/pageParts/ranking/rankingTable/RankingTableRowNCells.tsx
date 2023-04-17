import {type CategoryShortCode} from "../../../../types/Category";
import {type ProcessedRankingRunner} from "../../../../types/Ranking";
import {type GenderWithMixed} from "../../../../types/Runner";

interface RankingTableRowNCellsProps {
    runner: ProcessedRankingRunner;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
}

export default function RankingTableRowNCells({runner, tableCategory, tableGender}: RankingTableRowNCellsProps) {
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
}
