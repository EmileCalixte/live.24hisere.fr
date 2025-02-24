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
          rankingRunner.gender === runner.gender
          && getCategory(Number(rankingRunner.birthYear), { date: new Date(race.startTime) }).code === categoryCode,
      ).length,
    [categoryCode, race.startTime, ranking, runner.gender],
  );

  const showGaps = !race.isBasicRanking;

  return (
    <table className="table">
      <thead>
        <tr>
          <th rowSpan={2}>Cat.</th>
          <th rowSpan={2}>N°</th>
          {showGaps && <th colSpan={2}>Écarts</th>}
        </tr>
        {showGaps && (
          <tr>
            <th>Premier coureur</th>
            <th>Coureur précédent</th>
          </tr>
        )}
      </thead>
      <tbody>
        <tr>
          <td>Scratch</td>
          <td>
            <strong>{runner.ranks.displayed.scratchMixed}</strong>&nbsp;<small>/&nbsp;{scratchMixedRunnerCount}</small>
          </td>
          {showGaps && (
            <>
              <td>{formatGapForTable(runner.gaps.firstRunner.scratchMixed.gap)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.scratchMixed.gap)}</td>
            </>
          )}
        </tr>
        <tr>
          <td>{genderString}</td>
          <td>
            <strong>{runner.ranks.displayed.scratchGender}</strong>&nbsp;
            <small>/&nbsp;{scratchGenderRunnerCount}</small>
          </td>
          {showGaps && (
            <>
              <td>{formatGapForTable(runner.gaps.firstRunner.scratchGender.gap)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.scratchGender.gap)}</td>
            </>
          )}
        </tr>
        <tr>
          <td>{categoryCode} mixte</td>
          <td>
            <strong>{runner.ranks.displayed.categoryMixed}</strong>&nbsp;
            <small>/&nbsp;{categoryMixedRunnerCount}</small>
          </td>
          {showGaps && (
            <>
              <td>{formatGapForTable(runner.gaps.firstRunner.categoryMixed.gap)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.categoryMixed.gap)}</td>
            </>
          )}
        </tr>
        <tr>
          <td>
            {categoryCode} {genderString}
          </td>
          <td>
            <strong>{runner.ranks.displayed.categoryGender}</strong>&nbsp;
            <small>/&nbsp;{categoryGenderRunnerCount}</small>
          </td>
          {showGaps && (
            <>
              <td>{formatGapForTable(runner.gaps.firstRunner.categoryGender.gap)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.categoryGender.gap)}</td>
            </>
          )}
        </tr>
      </tbody>
    </table>
  );
}
