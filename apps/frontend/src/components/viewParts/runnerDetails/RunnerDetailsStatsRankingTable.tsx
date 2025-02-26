import React from "react";
import { getCategory } from "@emilecalixte/ffa-categories";
import { GENDER } from "@live24hisere/core/constants";
import type { PublicRace } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import type { Ranking, RankingRunner, RankingRunnerGap } from "../../../types/Ranking";
import { isRaceFinished } from "../../../utils/raceUtils";
import { formatGap } from "../../../utils/runnerUtils";
import { appContext } from "../../App";

interface RunnerDetailsStatsGapsTableProps {
  race: PublicRace;
  runner: RankingRunner;
  ranking: Ranking;
}

function formatGapForTable(gap: RankingRunnerGap | null, noOnlyTime: boolean): string {
  return formatGap(gap, { exhaustive: true, noOnlyTime }) ?? NO_VALUE_PLACEHOLDER;
}

export default function RunnerDetailsStatsRankingTable({
  race,
  runner,
  ranking,
}: RunnerDetailsStatsGapsTableProps): React.ReactElement {
  const { serverTimeOffset } = React.useContext(appContext).appData;

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

  // TODO change to 'formatGapWithDistanceIf0Laps' ? Maybe later
  const formatGapWithOnlyLaps = isRaceFinished(race, serverTimeOffset) && race.isImmediateStop;

  return (
    <table className="table">
      <thead>
        <tr>
          <th colSpan={42}>Classements</th>
        </tr>
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
              <td>{formatGapForTable(runner.gaps.firstRunner.scratchMixed.gap, formatGapWithOnlyLaps)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.scratchMixed.gap, formatGapWithOnlyLaps)}</td>
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
              <td>{formatGapForTable(runner.gaps.firstRunner.scratchGender.gap, formatGapWithOnlyLaps)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.scratchGender.gap, formatGapWithOnlyLaps)}</td>
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
              <td>{formatGapForTable(runner.gaps.firstRunner.categoryMixed.gap, formatGapWithOnlyLaps)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.categoryMixed.gap, formatGapWithOnlyLaps)}</td>
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
              <td>{formatGapForTable(runner.gaps.firstRunner.categoryGender.gap, formatGapWithOnlyLaps)}</td>
              <td>{formatGapForTable(runner.gaps.previousRunner.categoryGender.gap, formatGapWithOnlyLaps)}</td>
            </>
          )}
        </tr>
      </tbody>
    </table>
  );
}
