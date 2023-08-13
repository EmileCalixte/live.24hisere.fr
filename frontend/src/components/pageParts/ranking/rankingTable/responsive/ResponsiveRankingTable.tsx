import { useCallback } from "react";
import { GENDER_MIXED } from "../../../../../constants/Gender";
import { getCategoryCodeFromBirthYear } from "../../../../../util/ffaUtils";
import RankingTableInfoHeader from "../RankingTableInfoHeader";
import ResponsiveRankingTableRow from "./ResponsiveRankingTableRow";

interface ResponsiveRankingTableProps {
    race: Race;
    ranking: ProcessedRanking;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
    tableRaceDuration: number | null;
}

export default function ResponsiveRankingTable({
    race,
    ranking,
    tableCategory,
    tableGender,
    tableRaceDuration,
}: ResponsiveRankingTableProps): JSX.Element {
    const getRankingTableRow = useCallback((rankingRunner: ProcessedRankingRunner) => {
        const runnerCategory = getCategoryCodeFromBirthYear(rankingRunner.birthYear);

        if (tableCategory !== null) {
            if (tableCategory !== runnerCategory) {
                return null;
            }
        }

        if (tableGender !== GENDER_MIXED) {
            if (tableGender.toUpperCase() !== rankingRunner.gender.toUpperCase()) {
                return null;
            }
        }

        return (
            <ResponsiveRankingTableRow key={rankingRunner.id}
                                       runner={rankingRunner}
                                       tableCategory={tableCategory}
                                       tableGender={tableGender}
            />
        );
    }, [tableCategory, tableGender]);

    return (
        <table id="ranking-table" className="table responsive-ranking-table">
            <thead>
                <tr>
                    <RankingTableInfoHeader race={race}
                                            tableCategory={tableCategory}
                                            tableGender={tableGender}
                                            tableRaceDuration={tableRaceDuration}
                    />
                </tr>
            </thead>
            <tbody>
                {ranking.map(runner => getRankingTableRow(runner))}
            </tbody>
        </table>
    );
}
