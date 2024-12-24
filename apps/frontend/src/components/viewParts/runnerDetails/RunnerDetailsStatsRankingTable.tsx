import React from "react";
import { getCategory } from "@emilecalixte/ffa-categories";
import { GENDER } from "@live24hisere/core/constants";
import type { PublicRace } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import type { Ranking, RankingRunner, RankingRunnerGap } from "../../../types/Ranking";
import { formatGap } from "../../../utils/runnerUtils";

interface RunnerDetailsStatsGapsTableProps {
  race: PublicRace;
  runner: RankingRunner;
  ranking: Ranking;
}

function formatGapForTable(gap: RankingRunnerGap | null): string {
  return formatGap(gap, true) ?? NO_VALUE_PLACEHOLDER;
}

export default function RunnerDetailsStatsRankingTable({
  race,
  runner,
  ranking,
}: RunnerDetailsStatsGapsTableProps): React.ReactElement {
  const categoryCode = getCategory(Number(runner.birthYear), { date: new Date(race.startTime) }).code;
  const genderString = runner.gender === GENDER.F ? "Féminin" : "Masculin";

  const scratchMixedRunnerCount = ranking.length;

  const scratchGenderRunnerCount = React.useMemo(
    () => ranking.filter((rankingRunner) => rankingRunner.gender === runner.gender).length,
    [ranking, runner.gender],
  );

  const categoryMixedRunnerCount = React.useMemo(
    () =>
      ranking.filter(
        (rankingRunner) =>
          getCategory(Number(rankingRunner.birthYear), { date: new Date(race.startTime) }).code === categoryCode,
      ).length,
    [ranking, race.startTime, categoryCode],
  );

  const categoryGenderRunnerCount = React.useMemo(
    () =>
      ranking.filter(
        (rankingRunner) =>
          rankingRunner.gender === runner.gender &&
          getCategory(Number(rankingRunner.birthYear), { date: new Date(race.startTime) }).code === categoryCode,
      ).length,
    [categoryCode, race.startTime, ranking, runner.gender],
  );

  return (
    <table className="table no-full-width">
      <thead>
        <tr>
          <th colSpan={42}>Classements</th>
        </tr>
        <tr>
          <th rowSpan={2}>Classement</th>
          <th rowSpan={2}>N°</th>
          <th colSpan={2}>Écarts</th>
        </tr>
        <tr>
          <th>Premier coureur</th>
          <th>Coureur précédent</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Scratch</td>
          <td>
            {runner.ranks.displayed.scratchMixed} / {scratchMixedRunnerCount}
          </td>
          <td>{formatGapForTable(runner.gaps.firstRunner.scratchMixed.gap)}</td>
          <td>{formatGapForTable(runner.gaps.previousRunner.scratchMixed.gap)}</td>
        </tr>
        <tr>
          <td>{genderString}</td>
          <td>
            {runner.ranks.displayed.scratchGender} / {scratchGenderRunnerCount}
          </td>
          <td>{formatGapForTable(runner.gaps.firstRunner.scratchGender.gap)}</td>
          <td>{formatGapForTable(runner.gaps.previousRunner.scratchGender.gap)}</td>
        </tr>
        <tr>
          <td>{categoryCode} mixte</td>
          <td>
            {runner.ranks.displayed.categoryMixed} / {categoryMixedRunnerCount}
          </td>
          <td>{formatGapForTable(runner.gaps.firstRunner.categoryMixed.gap)}</td>
          <td>{formatGapForTable(runner.gaps.previousRunner.categoryMixed.gap)}</td>
        </tr>
        <tr>
          <td>
            {categoryCode} {genderString}
          </td>
          <td>
            {runner.ranks.displayed.categoryGender} / {categoryGenderRunnerCount}
          </td>
          <td>{formatGapForTable(runner.gaps.firstRunner.categoryGender.gap)}</td>
          <td>{formatGapForTable(runner.gaps.previousRunner.categoryGender.gap)}</td>
        </tr>
      </tbody>
    </table>
  );
}
