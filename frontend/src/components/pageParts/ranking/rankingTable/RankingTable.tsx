import { type ReactNode } from "react";
import { GENDER_MIXED } from "../../../../constants/Gender";
import { type CategoryShortCode } from "../../../../types/Category";
import { type GenderWithMixed } from "../../../../types/Gender";
import { type Race } from "../../../../types/Race";
import { type ProcessedRanking, type ProcessedRankingRunner } from "../../../../types/Ranking";
import { getCategoryCodeFromBirthYear } from "../../../../util/ffaUtils";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import RankingTableRow from "./RankingTableRow";

interface RankingTableProps {
    race: Race;
    ranking: ProcessedRanking;
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
}: RankingTableProps): JSX.Element {
    const getRankingTableRow = (rankingRunner: ProcessedRankingRunner): ReactNode => {
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
            <RankingTableRow key={rankingRunner.id}
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
                    <th className="hide-on-print">Détails</th>
                </tr>
            </thead>
            <tbody>
                {ranking.map((runner) => getRankingTableRow(runner))}
            </tbody>
        </table>
    );
}
