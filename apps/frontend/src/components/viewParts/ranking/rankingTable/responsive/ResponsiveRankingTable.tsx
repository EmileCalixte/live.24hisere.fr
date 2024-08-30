import React, { useCallback } from "react";
import {
    type CategoryShortCode,
    type GenderWithMixed,
} from "@live24hisere/types";
import { type Race } from "../../../../../types/Race";
import { type Ranking, type RankingRunner } from "../../../../../types/Ranking";
import { getCategoryCodeFromBirthYear } from "../../../../../utils/ffaUtils";
import RankingTableInfoHeader from "../RankingTableInfoHeader";
import ResponsiveRankingTableRow from "./ResponsiveRankingTableRow";

interface ResponsiveRankingTableProps {
    race: Race;
    ranking: Ranking;
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
}: ResponsiveRankingTableProps): React.ReactElement {
    const getRankingTableRow = useCallback(
        (rankingRunner: RankingRunner) => {
            const runnerCategory = getCategoryCodeFromBirthYear(
                rankingRunner.birthYear,
            );

            if (tableCategory !== null) {
                if (tableCategory !== runnerCategory) {
                    return null;
                }
            }

            if (tableGender !== "mixed") {
                if (
                    tableGender.toUpperCase() !==
                    rankingRunner.gender.toUpperCase()
                ) {
                    return null;
                }
            }

            return (
                <ResponsiveRankingTableRow
                    key={rankingRunner.id}
                    runner={rankingRunner}
                    tableCategory={tableCategory}
                    tableGender={tableGender}
                />
            );
        },
        [tableCategory, tableGender],
    );

    return (
        <table id="ranking-table" className="table responsive-ranking-table">
            <thead>
                <tr>
                    <RankingTableInfoHeader
                        race={race}
                        tableCategory={tableCategory}
                        tableGender={tableGender}
                        tableRaceDuration={tableRaceDuration}
                    />
                </tr>
            </thead>
            <tbody>{ranking.map((runner) => getRankingTableRow(runner))}</tbody>
        </table>
    );
}
