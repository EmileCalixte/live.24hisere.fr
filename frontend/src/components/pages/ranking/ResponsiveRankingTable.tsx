import React, {useCallback} from "react";
import {CategoryShortCode} from "../../../types/Category";
import {Race} from "../../../types/Race";
import {ProcessedRanking, ProcessedRankingRunner} from "../../../types/Ranking";
import {GenderWithMixed} from "../../../types/Runner";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import ResponsiveRankingTableRow from "./ResponsiveRankingTableRow";

const ResponsiveRankingTable: React.FunctionComponent<{
    race: Race
    ranking: ProcessedRanking,
    tableCategory: CategoryShortCode | null,
    tableGender: GenderWithMixed,
    tableRaceDuration: number | null,
}> = ({race, ranking, tableCategory, tableGender, tableRaceDuration}) => {
    const getRankingTableRow = useCallback((rankingRunner: ProcessedRankingRunner) => {
        if (tableCategory !== null) {
            if (tableCategory.toUpperCase() !== rankingRunner.category.toUpperCase()) {
                return null;
            }
        }

        if (tableGender !== "mixed") {
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

export default ResponsiveRankingTable;
