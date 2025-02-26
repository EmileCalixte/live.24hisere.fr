import type {
  Participant,
  PassageWithRunnerIdAndRaceId,
  PublicPassage,
  PublicRace,
  PublicRunner,
  RaceRunner,
  RaceRunnerWithPassages,
  RaceRunnerWithProcessedData,
  RaceRunnerWithProcessedPassages,
  RunnerProcessedData,
} from "@live24hisere/core/types";
import { compareUtils, dateUtils, objectUtils, stringUtils } from "@live24hisere/utils";
import { spaceship } from "../../../../packages/utils/src/compare-utils";
import { excludeKeys } from "../../../../packages/utils/src/object-utils";
import type { SelectOption } from "../types/Forms";
import type { RankingRunnerGap } from "../types/Ranking";
import { formatDurationHms, formatMsAsDuration } from "./durationUtils";
import { getPaceFromSpeed, getSpeed } from "./mathUtils";
import { getSortedPassages } from "./passageUtils";

export function getRaceRunnerFromRunnerAndParticipant<TRunner extends PublicRunner>(
  runner: TRunner,
  participant: Participant,
): RaceRunner<TRunner> {
  return {
    ...runner,
    ...excludeKeys(participant, ["id", "runnerId"]),
  };
}

export function getRunnersWithPassagesFromRunnersAndPassages<
  TRunner extends RaceRunner,
  TPassage extends PassageWithRunnerIdAndRaceId,
>(runners: TRunner[], passages: TPassage[]): Array<RaceRunnerWithPassages<TRunner, TPassage>> {
  /**
   * A map with runner ID as key and array of passages as value
   */
  const runnerPassages = new Map<number, TPassage[]>();

  for (const passage of passages) {
    const passageTime = new Date(passage.time);

    if (!dateUtils.isDateValid(passageTime)) {
      continue;
    }

    if (runnerPassages.has(passage.runnerId)) {
      runnerPassages.get(passage.runnerId)?.push(passage);
    } else {
      runnerPassages.set(passage.runnerId, [passage]);
    }
  }

  return runners.map((runner) =>
    getRunnerWithPassagesFromRunnerAndPassages(runner, runnerPassages.get(runner.id) ?? []),
  );
}

export function getRunnerWithPassagesFromRunnerAndPassages<TRunner extends RaceRunner, TPassage extends PublicPassage>(
  runner: TRunner,
  passages: TPassage[],
): TRunner & { passages: TPassage[] } {
  return {
    ...runner,
    passages: getSortedPassages(passages),
  };
}

export function getBasicRankingRunnerProcessedData(
  participant: Participant | RaceRunner,
  race: PublicRace,
): RunnerProcessedData {
  const totalDistance = Number(participant.finalDistance);

  if (!totalDistance) {
    return {
      lastPassageTime: null,
      averageSpeedToLastPassage: null,
      averagePaceToLastPassage: null,
      totalAverageSpeed: null,
      totalAveragePace: null,
      totalDistance: 0,
      distanceToLastPassage: 0,
    };
  }

  const totalAverageSpeed = getSpeed(totalDistance, race.duration * 1000);
  const totalAveragePace = getPaceFromSpeed(totalAverageSpeed);

  return {
    lastPassageTime: null,
    distanceToLastPassage: 0,
    averageSpeedToLastPassage: null,
    averagePaceToLastPassage: null,
    totalDistance,
    totalAverageSpeed,
    totalAveragePace,
  };
}

/**
 * Computes the gap between two runners of a race
 * @param runner1 Must be the highest-ranking runner
 * @param runner2 Must be the lowest-ranking runner
 */
export function getGapBetweenRunners(
  runner1: RaceRunnerWithProcessedPassages & RaceRunnerWithProcessedData,
  runner2: RaceRunnerWithProcessedPassages & RaceRunnerWithProcessedData,
): RankingRunnerGap | null {
  if (Object.is(runner1, runner2)) {
    return null;
  }

  const runner1PassageCount = runner1.passages.length;
  const runner2PassageCount = runner2.passages.length;

  if (runner1PassageCount === 0) {
    return null;
  }

  if (runner2PassageCount === 0) {
    const runner1LastPassage = runner1.passages[runner1.passages.length - 1];

    return {
      laps: runner1LastPassage.processed.lapNumber ?? 0,
      time: runner1LastPassage.processed.lapEndRaceTime,
    };
  }

  const passageCountDifference = runner1PassageCount - runner2PassageCount;

  const runner2LastPassage = runner2.passages[runner2.passages.length - 1];

  const runner1SameLapNumberPassage = runner1.passages.find(
    (passage) => passage.processed.lapNumber === runner2LastPassage.processed.lapNumber,
  );

  if (!runner1SameLapNumberPassage) {
    throw new Error("Runner 1");
  }

  const passageTimeGap =
    runner2LastPassage.processed.lapEndRaceTime - runner1SameLapNumberPassage.processed.lapEndRaceTime;

  return {
    laps: passageCountDifference,
    time: passageTimeGap,
  };
}

const formatGapDefaultOptions = {
  /**
   * If false (default), gap will be formatted with the number of gap laps only if it is greater than 1, and with the gap duration otherwise.
   * If true, gap will be formatted with the number of gap laps if it is greater than 1 AND with the gap duration.
   */
  exhaustive: false,

  /**
   * If true, the gap will not be formatted with time only when the gap is less than one lap. If there is at least one lap gap, the `exhaustive` rule applies.
   */
  noOnlyTime: false,
};

export function formatGap(
  gap: RankingRunnerGap | null,
  options: Partial<typeof formatGapDefaultOptions> = {},
): string | null {
  const opt = objectUtils.assignDefined(formatGapDefaultOptions, options);
  const { exhaustive, noOnlyTime: onlyLaps } = opt;

  if (!gap) {
    return null;
  }

  if (gap.laps < 1 && onlyLaps) {
    return "=";
  }

  if (gap.time < 0 && gap.laps < 1) {
    return "=";
  }

  const timeGap = `+${formatDurationHms(gap.time)}`;

  if (gap.laps === 0) {
    return timeGap;
  }

  const lapsGap = `+${gap.laps} ${gap.laps > 1 ? "tours" : "tour"}`;

  if (!exhaustive || gap.time < 0) {
    return lapsGap;
  }

  return `${lapsGap} (${timeGap})`;
}

/**
 * Compare two runners
 * Returns -1 if `runner1` is faster, 1 if `runner2` is faster and 0 if the runners are equal
 *
 * - If race is in basic ranking mode, simply compare total distance of the two runners
 * - Else
 *   - If race is not finished yet
 *     - If the two runners have a different passage count, the one with the most passages is considered faster
 *     - If the two runners have the same passage count, the one with the earliest last passage is considered faster
 *     - If both runners have the same passage count and the same last passage time, they are equal
 *   - If race is finished
 *     - If the two runners don't have the same total distance, the one with the greater distance is considered faster
 *     - If the two runners have the same total distance
 *       - If at least one of the two runners have a `finalDistance`, they are considered equal
 *       - If neither runner has a `totalDistance`, the one with the earliest last passage is considered faster. They are equal if they have the same last passage time
 */
export function spaceshipRunners(
  runner1: RaceRunnerWithPassages & RaceRunnerWithProcessedData,
  runner2: RaceRunnerWithPassages & RaceRunnerWithProcessedData,
  isBasicRanking: boolean,
  isRaceFinished: boolean,
): ReturnType<typeof compareUtils.spaceship> {
  if (isBasicRanking) {
    return compareUtils.spaceship(Number(runner2.totalDistance), Number(runner1.totalDistance));
  }

  if (isRaceFinished) {
    if (
      runner1.totalDistance === runner2.totalDistance
      && !parseFloat(runner1.finalDistance)
      && !parseFloat(runner2.finalDistance)
    ) {
      // When two runners have covered the same distance before the end of the race,
      // the one who has completed them the fastest is considered to be faster than the other.
      return compareUtils.spaceship(runner1.lastPassageTime?.raceTime, runner2.lastPassageTime?.raceTime);
    }

    return compareUtils.spaceship(Number(runner2.totalDistance), Number(runner1.totalDistance));
  }

  const runner1PassageCount = runner1.passages.length;
  const runner2PassageCount = runner2.passages.length;

  if (runner1PassageCount === runner2PassageCount) {
    // When two runners have completed the same number of laps,
    // the one who has completed them the fastest is considered to be faster than the other.
    return compareUtils.spaceship(runner1.lastPassageTime?.raceTime, runner2.lastPassageTime?.raceTime);
  }

  return compareUtils.spaceship(runner2PassageCount, runner1PassageCount);
}

export function spaceshipRunnersByName(
  runner1: PublicRunner,
  runner2: PublicRunner,
): ReturnType<typeof compareUtils.spaceship> {
  if (stringUtils.latinizedEquals(runner1.lastname, runner2.lastname)) {
    return spaceship(stringUtils.latinize(runner1.firstname), stringUtils.latinize(runner2.firstname));
  }

  return spaceship(stringUtils.latinize(runner1.lastname), stringUtils.latinize(runner2.lastname));
}

/**
 * Returns true if two runners are equal (same number of laps and last passage at the same time)
 */
export function areRunnersEqual(
  runner1: RaceRunnerWithPassages & RaceRunnerWithProcessedData,
  runner2: RaceRunnerWithPassages & RaceRunnerWithProcessedData,
  isBasicRanking: boolean,
  isRaceFinished: boolean,
): boolean {
  return spaceshipRunners(runner1, runner2, isBasicRanking, isRaceFinished) === 0;
}

/**
 * Returns an array of select options from an array of runners
 * @param runners
 * @param label an optional callback function to format the label
 */
export function getRunnersSelectOptions<TRunner extends PublicRunner>(
  runners: TRunner[] | false,
  label?: (runner: TRunner) => string,
): SelectOption[] {
  if (!runners) {
    return [];
  }

  return runners.map((runner) => ({
    label: label ? label(runner) : `N° ${runner.id} – ${runner.lastname.toUpperCase()} ${runner.firstname}`,
    value: runner.id,
  }));
}

/**
 * Returns runner data ready for excel export
 */
export function getDataForExcelExport(runner: RaceRunnerWithProcessedPassages): object[] {
  const excelData: object[] = [];

  runner.passages.forEach((passage) => {
    excelData.push({
      Tours: passage.processed.lapNumber,
      "Temps total": formatMsAsDuration(passage.processed.lapEndRaceTime),
      "Temps total (s)": Math.round(passage.processed.lapEndRaceTime / 1000),
      "Distance totale (m)": passage.processed.totalDistance,
      "Temps tour": formatMsAsDuration(passage.processed.lapDuration, { forceDisplayHours: false }),
      "Temps tour (s)": Math.round(passage.processed.lapDuration / 1000),
      "Distance tour (m)": passage.processed.lapDistance,
      "Vitesse tour (km/h)": passage.processed.lapSpeed,
      "Allure tour (min/km)": formatMsAsDuration(passage.processed.lapPace, { forceDisplayHours: false }),
      "Vitesse moyenne depuis départ (km/h)": passage.processed.averageSpeedSinceRaceStart,
      "Allure moyenne depuis départ (min/km)": formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, {
        forceDisplayHours: false,
      }),
    });
  });

  return excelData;
}
