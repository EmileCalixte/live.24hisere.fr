import {Race} from "../../../types/Race";
import RankingTableRow from "./RankingTableRow";
import {Category} from "./Ranking";
import Util from "../../../util/Util";
import React from "react";
import {ProcessedRanking, ProcessedRankingRunner} from "../../../types/Ranking";
import {Gender, GenderWithMixed} from "../../../types/Runner";

const RankingTable: React.FunctionComponent<{
    race: Race
    ranking: ProcessedRanking,
    tableCategory: string,
    tableGender: GenderWithMixed,
    tableRaceDuration: number | null,
}> = ({race, ranking, tableCategory, tableGender, tableRaceDuration}) => {
    const getRankingTableRow = (rankingRunner: ProcessedRankingRunner) => {
        if (tableCategory !== Category.Team && rankingRunner.isTeam) {
            return null;
        } else if (tableCategory === Category.Team && !rankingRunner.isTeam) {
            return null;
        } else if (tableCategory !== Category.All && tableCategory !== Category.Team) {
            if (tableCategory.toUpperCase() !== rankingRunner.category.toUpperCase()) {
                return null;
            }
        }

        if (tableCategory !== Category.Team) {
            if (tableGender !== "mixed") {
                if (tableGender.toUpperCase() !== rankingRunner.gender.toUpperCase()) {
                    return null;
                }
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
                <td colSpan={42} className="ranking-table-info-header">
                    {race.name} : Classement {(() => {
                        if (tableCategory === Category.Team) {
                            return 'équipes';
                        } else if (tableCategory === Category.All) {
                            return 'scratch';
                        } else {
                            return tableCategory.toUpperCase();
                        }
                    })()} {(() => {
                        if (tableCategory === Category.Team) {
                            return null;
                        }

                        if (tableGender === "mixed") {
                            return 'mixte';
                        } else if (tableGender === Gender.M) {
                            return 'hommes';
                        } else if (tableGender === Gender.F) {
                            return 'femmes';
                        } else {
                            return tableGender;
                        }
                    })()} {(() => {
                        if (tableRaceDuration !== null) {
                            return `à ${Util.formatMsAsDuration(tableRaceDuration)} de course`;
                        }
                    })()}
                </td>
            </tr>
            <tr>
                <th colSpan={tableCategory === Category.Team ? 1 : 4}>N°</th>
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
