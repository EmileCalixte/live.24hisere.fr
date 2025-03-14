import React from "react";
import { type CategoryCode, getCategory } from "@emilecalixte/ffa-categories";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import type { RankingRunner } from "../../../../../types/Ranking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../../utils/countryUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";
import { getRankingType } from "../../../../../utils/rankingUtils";
import { formatGap, type FormatGapMode } from "../../../../../utils/runnerUtils";
import { formatFloatNumber } from "../../../../../utils/utils";
import RunnerStoppedBadge from "../../../../ui/badges/RunnerStoppedBadge";
import { Flag } from "../../../../ui/countries/Flag";
import { Link } from "../../../../ui/Link";
import { Td, Tr } from "../../../../ui/Table";

interface ResponsiveRankingTableRowProps {
  race: PublicRace;
  runner: RankingRunner;
  tableCategoryCode: CategoryCode | null;
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
        <div className="flex items-center gap-2">
          {alpha2CountryCode && <Flag countryCode={alpha2CountryCode} />}
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
      <Td className="relative p-0">
        {/*
        This is a little hack to make the clickable link take up the full height of the cell. We can't put a
        "height: 100%"" element in a cell, so we display our icon with 1% opacity (because 0% doesn't work well on some browsers (hello iOS)),
        and then on top of that, we set our link with the same icon with "position: absolute; inset: 0" so that it covers all cell
        */}
        <span className="opacity-1 px-3">
          <FontAwesomeIcon icon={faChevronRight} />
        </span>

        <Link
          to={`/runner-details/${runner.id}?race=${race.id}`}
          className="absolute inset-0 flex items-center px-3 text-neutral-500 dark:text-neutral-500"
          aria-label={`Consulter les détails du coureur ${runner.firstname} ${runner.lastname}`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Link>
      </Td>
    </Tr>
  );
}
