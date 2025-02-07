import React from "react";
import { type CategoryCode, getCategory } from "@emilecalixte/ffa-categories";
import { Link } from "react-router-dom";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { RankingRunner } from "../../../../../types/Ranking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../../utils/countryUtils";
import { getRankingType } from "../../../../../utils/rankingUtils";
import { formatGap } from "../../../../../utils/runnerUtils";
import { formatFloatNumber, formatMsAsDuration } from "../../../../../utils/utils";
import RunnerStoppedBadge from "../../../../ui/badges/RunnerStoppedBadge";
import { Flag } from "../../../../ui/countries/Flag";

interface ResponsiveRankingTableRowProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: CategoryCode | null;
  tableGender: GenderWithMixed;
  showLastPassageTime: boolean;
}

export default function ResponsiveRankingTableRow({
  race,
  runner,
  tableCategoryCode,
  tableGender,
  showLastPassageTime,
}: ResponsiveRankingTableRowProps): React.ReactElement {
  const runnerCategoryCode = getCategory(Number(runner.birthYear), { date: new Date(race.startTime) }).code;

  const rowRanking = React.useMemo(() => {
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

  const rowSecondaryRankings = React.useMemo(() => {
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

  const alpha2CountryCode = getCountryAlpha2CodeFromAlpha3Code(runner.countryCode);

  const formattedGap = formatGap(runner.gaps.firstRunner[getRankingType(tableCategoryCode, tableGender)].gap);

  const displayedGap = formattedGap && formattedGap !== "=" ? formattedGap : null;

  return (
    <tr>
      <td>
        <strong>{rowRanking}</strong>
      </td>
      <td style={{ width: "100%" }}>
        <Link to={`/runner-details/${runner.id}`}>
          <div className="d-flex align-items-center gap-2">
            {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
            <strong>
              {runner.lastname.toUpperCase()} {runner.firstname}
            </strong>
          </div>

          <div className="d-flex align-items-center gap-2">
            <strong>N° {runner.id}</strong>
            {runner.stopped && <RunnerStoppedBadge />}
          </div>

          {displayedGap && <div className="responsive-ranking-table-row-secondary-data-row">{displayedGap}</div>}

          <div className="responsive-ranking-table-row-secondary-data-row">{rowSecondaryRankings}</div>

          <div className="responsive-ranking-table-row-secondary-data-row">
            {formatFloatNumber(runner.totalDistance / 1000, 2)} km
            {(() => {
              if (runner.totalAverageSpeed === null) {
                return null;
              } else {
                return (
                  <>
                    &nbsp;–&nbsp;
                    {formatFloatNumber(runner.totalAverageSpeed, 2)} km/h moy.
                  </>
                );
              }
            })()}
          </div>
          {showLastPassageTime && (
            <div className="responsive-ranking-table-row-secondary-data-row">
              {(() => {
                if (runner.lastPassageTime === null) {
                  return null;
                } else {
                  return <>Dernier passage : {formatMsAsDuration(runner.lastPassageTime.raceTime)}</>;
                }
              })()}
            </div>
          )}
        </Link>
      </td>
    </tr>
  );
}
