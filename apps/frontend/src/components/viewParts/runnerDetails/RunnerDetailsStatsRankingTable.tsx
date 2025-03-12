import React from "react";
import { getCategory } from "@emilecalixte/ffa-categories";
import { GENDER } from "@live24hisere/core/constants";
import type { PublicRace } from "@live24hisere/core/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import { appContext } from "../../../contexts/AppContext";
import type { Ranking, RankingRunner, RankingRunnerGap } from "../../../types/Ranking";
import { isRaceFinished } from "../../../utils/raceUtils";
import { formatGap, FormatGapMode } from "../../../utils/runnerUtils";
import { Table, Td, Th, Tr } from "../../ui/Table";

interface RunnerDetailsStatsGapsTableProps {
  race: PublicRace;
  runner: RankingRunner;
  ranking: Ranking;
}

function formatGapForTable(gap: RankingRunnerGap | null, mode: FormatGapMode): string {
  return formatGap(gap, { mode }) ?? NO_VALUE_PLACEHOLDER;
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

  const formatGapMode =
    isRaceFinished(race, serverTimeOffset) && race.isImmediateStop
      ? FormatGapMode.LAPS_OR_DISTANCE
      : FormatGapMode.LAPS_AND_TIME;

  return (
    <Table className="w-full">
      <thead>
        <Tr>
          <Th colSpan={42}>Classements</Th>
        </Tr>
        <Tr>
          <Th rowSpan={2}>Cat.</Th>
          <Th rowSpan={2}>N°</Th>
          {showGaps && <Th colSpan={2}>Écarts</Th>}
        </Tr>
        {showGaps && (
          <Tr>
            <Th>Premier coureur</Th>
            <Th>Coureur précédent</Th>
          </Tr>
        )}
      </thead>
      <tbody>
        <Tr>
          <Td>Scratch</Td>
          <Td>
            <strong>{runner.ranks.displayed.scratchMixed}</strong>&nbsp;<small>/&nbsp;{scratchMixedRunnerCount}</small>
          </Td>
          {showGaps && (
            <>
              <Td>{formatGapForTable(runner.gaps.firstRunner.scratchMixed.gap, formatGapMode)}</Td>
              <Td>{formatGapForTable(runner.gaps.previousRunner.scratchMixed.gap, formatGapMode)}</Td>
            </>
          )}
        </Tr>
        <Tr>
          <Td>{genderString}</Td>
          <Td>
            <strong>{runner.ranks.displayed.scratchGender}</strong>&nbsp;
            <small>/&nbsp;{scratchGenderRunnerCount}</small>
          </Td>
          {showGaps && (
            <>
              <Td>{formatGapForTable(runner.gaps.firstRunner.scratchGender.gap, formatGapMode)}</Td>
              <Td>{formatGapForTable(runner.gaps.previousRunner.scratchGender.gap, formatGapMode)}</Td>
            </>
          )}
        </Tr>
        <Tr>
          <Td>{categoryCode} mixte</Td>
          <Td>
            <strong>{runner.ranks.displayed.categoryMixed}</strong>&nbsp;
            <small>/&nbsp;{categoryMixedRunnerCount}</small>
          </Td>
          {showGaps && (
            <>
              <Td>{formatGapForTable(runner.gaps.firstRunner.categoryMixed.gap, formatGapMode)}</Td>
              <Td>{formatGapForTable(runner.gaps.previousRunner.categoryMixed.gap, formatGapMode)}</Td>
            </>
          )}
        </Tr>
        <Tr>
          <Td>
            {categoryCode} {genderString}
          </Td>
          <Td>
            <strong>{runner.ranks.displayed.categoryGender}</strong>&nbsp;
            <small>/&nbsp;{categoryGenderRunnerCount}</small>
          </Td>
          {showGaps && (
            <>
              <Td>{formatGapForTable(runner.gaps.firstRunner.categoryGender.gap, formatGapMode)}</Td>
              <Td>{formatGapForTable(runner.gaps.previousRunner.categoryGender.gap, formatGapMode)}</Td>
            </>
          )}
        </Tr>
      </tbody>
    </Table>
  );
}
