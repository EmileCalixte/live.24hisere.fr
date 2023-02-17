import {CategoryShortCode} from "../../../types/Category";
import {Race} from "../../../types/Race";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import RankingTableRow from "./RankingTableRow";
import React from "react";
import {ProcessedRanking, ProcessedRankingRunner} from "../../../types/Ranking";
import {GenderWithMixed} from "../../../types/Runner";

const RankingTable: React.FunctionComponent<{
    race: Race
    ranking: ProcessedRanking,
    tableCategory: CategoryShortCode | null,
    tableGender: GenderWithMixed,
    tableRaceDuration: number | null,
}> = ({race, ranking, tableCategory, tableGender, tableRaceDuration}) => {
    const getRankingTableRow = (rankingRunner: ProcessedRankingRunner) => {
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
            <RankingTableRow key={rankingRunner.id}
                             runner={rankingRunner}
                             tableCategory={tableCategory}
                             tableGender={tableGender}
            />
        );
    }

    return (
        <table id="ranking-table" className="table">
            <thead>
            <tr>
                <RankingTableInfoHeader
                    race={race}
                    tableCategory={tableCategory}
                    tableGender={tableGender}
                    tableRaceDuration={tableRaceDuration}
                />
            </tr>
            <tr>
                <th colSpan={4}>N°</th>
                <th>Doss.</th>
                <th>Nom</th>
                <th>Nb. tours</th>
                <th>Distance</th>
                <th>Dernier passage</th>
                <th>Vitesse moy.</th>
                <th className="hide-on-print">Détails</th>
            </tr>
            </thead>
            <tbody>
            {ranking.map((runner) => getRankingTableRow(runner))}
            </tbody>
        </table>
    );
}

export default RankingTable;
