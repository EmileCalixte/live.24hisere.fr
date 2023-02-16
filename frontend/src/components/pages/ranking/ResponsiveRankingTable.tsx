import React from "react";
import {CategoryShortCode} from "../../../types/Category";
import {Race} from "../../../types/Race";
import {ProcessedRanking} from "../../../types/Ranking";
import {GenderWithMixed} from "../../../types/Runner";

const ResponsiveRankingTable: React.FunctionComponent<{
    race: Race
    ranking: ProcessedRanking,
    tableCategory: CategoryShortCode | null,
    tableGender: GenderWithMixed,
    tableRaceDuration: number | null,
}> = () => {
    return (
        <table id="ranking-table" className="table">

        </table>
    );
}

export default ResponsiveRankingTable;
