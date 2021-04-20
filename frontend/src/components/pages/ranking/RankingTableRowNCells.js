import Ranking, {CATEGORY_ALL, CATEGORY_TEAM, GENDER_MIXED} from "./Ranking";

const RankingTableRowNCells = ({runner, tableCategory, tableGender}) => {
    if (tableCategory === CATEGORY_TEAM) {
        return (
            <td>
                {runner.rankings.displayed.scratchMixed}
            </td>
        );
    } else if (tableCategory === CATEGORY_ALL) {
        if (tableGender === GENDER_MIXED) {
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
        if (tableGender === GENDER_MIXED) {
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
