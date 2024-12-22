import React, { useMemo } from "react";
import { type CategoryCode, getCategory } from "@emilecalixte/ffa-categories";
import { Link } from "react-router-dom";
import { type GenderWithMixed, type PublicRace } from "@live24hisere/core/types";
import { type RankingRunner } from "../../../../../types/Ranking";
import { getRankingType } from "../../../../../utils/rankingUtils";
import { formatGap } from "../../../../../utils/runnerUtils";
import { formatFloatNumber, formatMsAsDuration } from "../../../../../utils/utils";
import RunnerStoppedBadge from "../../../../ui/badges/RunnerStoppedBadge";

interface ResponsiveRankingTableRowProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
}

export default function ResponsiveRankingTableRow({
  race,
  runner,
  tableCategoryCode,
  tableGender,
}: ResponsiveRankingTableRowProps): React.ReactElement {
  const runnerCategoryCode = getCategory(Number(runner.birthYear), { date: new Date(race.startTime) }).code;

  const rowRanking = useMemo(() => {
    if (tableCategoryCode === null) {
      if (tableGender === "mixed") {
        return runner.ranks.displayed.scratchMixed;
      }

      return runner.ranks.displayed.scratchGender;
    }

    if (tableGender === "mixed") {
      return runner.ranks.displayed.categoryMixed;
    }

    return runner.ranks.displayed.categoryGender;
  }, [runner, tableCategoryCode, tableGender]);

  const rowSecondaryRankings = useMemo(() => {
    if (tableCategoryCode === null) {
      if (tableGender === "mixed") {
        return (
          <>
            {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
            &nbsp;|&nbsp;
            {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
            &nbsp;|&nbsp;
            {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
          </>
        );
      }

      return (
        <>
          {runner.ranks.displayed.scratchMixed}
          &nbsp;|&nbsp;
          {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
          &nbsp;|&nbsp;
          {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
        </>
      );
    }

    if (tableGender === "mixed") {
      return (
        <>
          {runner.ranks.displayed.scratchMixed}
          &nbsp;|&nbsp;
          {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
          &nbsp;|&nbsp;
          {runner.ranks.displayed.categoryGender} {runnerCategoryCode}-{runner.gender.toUpperCase()}
        </>
      );
    }

    return (
      <>
        {runner.ranks.displayed.scratchMixed}
        &nbsp;|&nbsp;
        {runner.ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
        &nbsp;|&nbsp;
        {runner.ranks.displayed.categoryMixed} {runnerCategoryCode}
      </>
    );
  }, [runner, tableCategoryCode, tableGender, runnerCategoryCode]);

  const formattedGap = formatGap(runner.gaps.firstRunner[getRankingType(tableCategoryCode, tableGender)].gap);

  const displayedGap = formattedGap === null || formattedGap === "=" ? null : formattedGap;

  return (
    <tr>
      <td>
        <strong>{rowRanking}</strong>
      </td>
      <td style={{ width: "100%" }}>
        <Link to={`/runner-details/${runner.id}`}>
          <div>
            <strong>
              {runner.lastname.toUpperCase()} {runner.firstname} – N°{runner.id}
            </strong>
            {runner.stopped && <RunnerStoppedBadge />}
          </div>

          {displayedGap && <div className="responsive-ranking-table-row-secondary-data-row">{displayedGap}</div>}

          <div className="responsive-ranking-table-row-secondary-data-row">{rowSecondaryRankings}</div>

          <div className="responsive-ranking-table-row-secondary-data-row">
            {formatFloatNumber(runner.distance / 1000, 2)} km
            {(() => {
              if (runner.averageSpeed === null) {
                return null;
              } else {
                return (
                  <>
                    &nbsp;–&nbsp;
                    {formatFloatNumber(runner.averageSpeed, 2)} km/h moy.
                  </>
                );
              }
            })()}
            {(() => {
              if (runner.lastPassageTime === null) {
                return null;
              } else {
                return <>&nbsp;–&nbsp; Dernier passage {formatMsAsDuration(runner.lastPassageTime.raceTime)}</>;
              }
            })()}
          </div>
        </Link>
      </td>
    </tr>
  );
}
