import React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { useGetRunnerCategory } from "../../../../../hooks/useGetRunnerCategory";
import type { RankingRunner } from "../../../../../types/Ranking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../../utils/countryUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";
import { getRankingType } from "../../../../../utils/rankingUtils";
import { formatGap, type FormatGapMode } from "../../../../../utils/runnerUtils";
import { formatFloatNumber } from "../../../../../utils/utils";
import RunnerStoppedBadge from "../../../../ui/badges/RunnerStoppedBadge";
import { Flag } from "../../../../ui/countries/Flag";
import GenderIcon from "../../../../ui/genders/GenderIcon";
import { Td, Tr } from "../../../../ui/Table";
import ResponsiveTableRunnerLinkTd from "../../ResponsiveTableRunnerLinkTd";

interface ResponsiveRankingTableRowProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
  showLastPassageTime: boolean;
  formatGapMode: FormatGapMode;
  showRunnerStoppedBadges: boolean;
}

export default function ResponsiveRankingTableRow({
  race,
  runner,
  tableCategoryCode,
  tableGender,
  showLastPassageTime,
  formatGapMode,
  showRunnerStoppedBadges,
}: ResponsiveRankingTableRowProps): React.ReactElement {
  const getCategory = useGetRunnerCategory();

  const runnerCategoryCode = getCategory(runner, new Date(race.startTime)).code;

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

  const formattedGap = formatGap(runner.gaps.firstRunner[getRankingType(tableCategoryCode, tableGender)].gap, {
    mode: formatGapMode,
  });

  const displayedGap = formattedGap && formattedGap !== "=" ? formattedGap : null;

  return (
    <Tr>
      <Td className="text-center">
        <strong>{rowRanking}</strong>
      </Td>
      <Td className="w-full">
        <div className="flex flex-wrap items-center gap-1.5">
          {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}

          <GenderIcon gender={runner.gender} />

          <strong>
            {runner.lastname.toUpperCase()} {runner.firstname}
          </strong>
        </div>

        <div className="flex items-center gap-2">
          <strong>N° {runner.bibNumber}</strong>
          {runner.stopped && showRunnerStoppedBadges && <RunnerStoppedBadge />}
        </div>

        {displayedGap && <div className="text-sm">{displayedGap}</div>}

        <div className="text-sm">{rowSecondaryRankings}</div>

        <div className="text-sm">
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
          <div className="text-sm">
            {(() => {
              if (runner.lastPassageTime === null) {
                return null;
              } else {
                return <>Dernier passage : {formatMsAsDuration(runner.lastPassageTime.raceTime)}</>;
              }
            })()}
          </div>
        )}
      </Td>
      <ResponsiveTableRunnerLinkTd race={race} runner={runner} />
    </Tr>
  );
}
