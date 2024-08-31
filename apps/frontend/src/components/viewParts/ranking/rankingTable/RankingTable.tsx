import React, { type ReactNode } from "react";
import {
    type CategoryShortCode,
    type GenderWithMixed,
    type Race,
} from "@live24hisere/types";
import { type Ranking, type RankingRunner } from "../../../../types/Ranking";
import { getCategoryCodeFromBirthYear } from "../../../../utils/ffaUtils";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import RankingTableRow from "./RankingTableRow";

interface RankingTableProps {
    race: Race;
    ranking: Ranking;
    tableCategory: CategoryShortCode | null;
    tableGender: GenderWithMixed;
    tableRaceDuration: number | null;
}

export default function RankingTable({
    race,
    ranking,
    tableCategory,
    tableGender,
    tableRaceDuration,
}: RankingTableProps): React.ReactElement {
    const getRankingTableRow = (rankingRunner: RankingRunner): ReactNode => {
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
                tableGender.toUpperCase() !== rankingRunner.gender.toUpperCase()
            ) {
                return null;
            }
        }

        return (
            <RankingTableRow
                key={rankingRunner.id}
                race={race}
                runner={rankingRunner}
                tableCategory={tableCategory}
                tableGender={tableGender}
            />
        );
    };

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
                    <th colSpan={4}>Classement</th>
                    <th>Doss.</th>
                    <th>Nom</th>
                    <th>Nb. tours</th>
                    <th>Distance</th>
                    <th>Dernier passage</th>
                    <th>Vitesse moy.</th>
                    <th>Écart 1er</th>
                    <th className="hide-on-print">Détails</th>
                </tr>
            </thead>
            <tbody>{ranking.map((runner) => getRankingTableRow(runner))}</tbody>
        </table>
    );
}
