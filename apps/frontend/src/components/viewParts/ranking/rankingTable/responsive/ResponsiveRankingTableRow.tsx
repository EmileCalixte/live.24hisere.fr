import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { Link } from "../../../../ui/Link";
import { Td, Tr } from "../../../../ui/Table";

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
        {/* As we cannot set up the link to take all available height in the cel, we use the 'after' pseudo-element to
        create a clickable zone which covers all the cell. Yes, it works */}
        <Link
          to={`/runner-details/${runner.id}?race=${race.id}`}
          className="flex items-center px-3 text-neutral-500 after:absolute after:inset-0 dark:text-neutral-500"
          aria-label={`Consulter les détails du coureur ${runner.firstname} ${runner.lastname}`}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Link>
      </Td>
    </Tr>
  );
}
