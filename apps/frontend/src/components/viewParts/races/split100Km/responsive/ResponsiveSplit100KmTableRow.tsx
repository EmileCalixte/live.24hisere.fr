import React from "react";
import type { GenderWithMixed, PublicRace } from "@live24hisere/core/types";
import { useGetRunnerCategory } from "../../../../../hooks/useGetRunnerCategory";
import type { SplitDistanceRankingRunner } from "../../../../../types/Ranking";
import { getCountryAlpha2CodeFromAlpha3Code } from "../../../../../utils/countryUtils";
import { formatMsAsDuration } from "../../../../../utils/durationUtils";
import { formatFloatNumber } from "../../../../../utils/utils";
import { Flag } from "../../../../ui/countries/Flag";
import GenderIcon from "../../../../ui/genders/GenderIcon";
import { Td, Tr } from "../../../../ui/Table";
import ResponsiveTableRunnerLinkTd from "../../ResponsiveTableRunnerLinkTd";

interface ResponsiveSplit100KmTableRowProps {
  race: PublicRace;
  runner: SplitDistanceRankingRunner;
  tableCategoryCode: string | null;
  tableGender: GenderWithMixed;
}

export default function ResponsiveSplit100KmTableRow({
  race,
  runner,
  tableCategoryCode,
  tableGender,
}: ResponsiveSplit100KmTableRowProps): React.ReactElement {
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

  const speedAt100Km = 360_000_000 / runner.raceTime;

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
        </div>

        <div className="text-sm">{rowSecondaryRankings}</div>

        <div className="text-sm">
          {!runner.exact && "≈ "}
          {formatMsAsDuration(runner.raceTime)}
          &nbsp;–&nbsp;
          {formatFloatNumber(speedAt100Km, 2)} km/h moy.
        </div>
      </Td>
      <ResponsiveTableRunnerLinkTd race={race} runner={runner} />
    </Tr>
  );
}
