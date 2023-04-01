import {type CategoryShortCode} from "../../../types/Category";
import {type Race} from "../../../types/Race";
import RankingTableInfoHeader from "./RankingTableInfoHeader";
import RankingTableRow from "./RankingTableRow";
import {type ProcessedRanking, type ProcessedRankingRunner} from "../../../types/Ranking";
import {type GenderWithMixed} from "../../../types/Runner";

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
}: RankingTableProps) {
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
