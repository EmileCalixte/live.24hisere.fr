import type {
  Participant,
  ProcessedPassage,
  PublicPassage,
  PublicRace,
  RaceRunner,
  RunnerProcessedData,
  RunnerProcessedTimeSlot,
} from "@live24hisere/core/types";
import { compareUtils, dateUtils } from "@live24hisere/utils";
import { getPaceFromSpeed, getSpeed } from "./mathUtils";
import { getDistanceFromPassageCount, getRaceTime } from "./raceUtils";

/**
 * Returns passages sorted in ascending time order
 */
export function getSortedPassages<TPassage extends PublicPassage>(passages: TPassage[]): TPassage[] {
  return passages.toSorted((passageA, passageB) =>
    compareUtils.spaceship(new Date(passageA.time).getTime(), new Date(passageB.time).getTime()),
  );
}

export function getRunnerProcessedDataFromPassages(
  participant: Participant | RaceRunner,
  race: PublicRace,
  passages: PublicPassage[],
  includeDistanceAfterLastPassage: boolean,
): RunnerProcessedData {
  if (!passages.length) {
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

  const lastPassageTimeDate = new Date(passages[passages.length - 1].time);

  const lastPassageTime: RunnerProcessedData["lastPassageTime"] = {
    time: lastPassageTimeDate,
    raceTime: getRaceTime(race, lastPassageTimeDate),
  };

  const distanceToLastPassage = getDistanceFromPassageCount(race, passages.length);

  const finalDistance = includeDistanceAfterLastPassage ? Number(participant.finalDistance) : 0;
  const totalDistance = distanceToLastPassage + finalDistance;

  const averageSpeedToLastPassage = getSpeed(distanceToLastPassage, lastPassageTime.raceTime);
  const averagePaceToLastPassage = getPaceFromSpeed(averageSpeedToLastPassage);

  const totalAverageSpeed = getSpeed(
    totalDistance,
    finalDistance > 0 ? race.duration * 1000 : lastPassageTime.raceTime,
  );

  const totalAveragePace = getPaceFromSpeed(totalAverageSpeed);

  return {
    lastPassageTime,
    distanceToLastPassage,
    averageSpeedToLastPassage,
    averagePaceToLastPassage,
    totalDistance,
    totalAverageSpeed,
    totalAveragePace,
  };
}

export function getProcessedPassagesFromPassages<TPassage extends PublicPassage>(
  race: PublicRace,
  passages: TPassage[],
): Array<ProcessedPassage<TPassage>> {
  const raceInitialDistance = Number(race.initialDistance);
  const raceLapDistance = Number(race.lapDistance);

  const processedPassages: Array<ProcessedPassage<TPassage>> = [];

  let totalDistance = 0;

  for (let i = 0; i < passages.length; ++i) {
    const isFirstPassage = i === 0;

    const passage = passages[i];
    const previousPassage = isFirstPassage ? null : passages[i - 1];

    let lapNumber: number | null = null;

    if (raceInitialDistance <= 0) {
      lapNumber = i + 1;
    } else {
      lapNumber = isFirstPassage ? null : i; // The first passage is an incomplete lap, so it's not counted
    }

    const lapDistance = lapNumber === null ? raceInitialDistance : raceLapDistance;
    const lapStartTime = previousPassage ? new Date(previousPassage.time) : new Date(race.startTime);
    const lapEndTime = new Date(passage.time);

    if (!dateUtils.isDateValid(lapStartTime)) {
      throw new Error("Invalid passage start time");
    }

    if (!dateUtils.isDateValid(lapEndTime)) {
      throw new Error("Invalid passage end time");
    }

    totalDistance += lapDistance;

    const lapStartRaceTime = getRaceTime(race, lapStartTime);
    const lapEndRaceTime = getRaceTime(race, lapEndTime);
    const lapDuration = lapEndRaceTime - lapStartRaceTime;

    const lapSpeed = getSpeed(lapDistance, lapDuration);
    const lapPace = getPaceFromSpeed(lapSpeed);

    const averageSpeedSinceRaceStart = getSpeed(totalDistance, lapEndRaceTime);
    const averagePaceSinceRaceStart = getPaceFromSpeed(averageSpeedSinceRaceStart);

    processedPassages.push({
      ...passage,
      processed: {
        lapNumber,
        lapDistance,
        lapDuration,
        lapStartTime,
        lapStartRaceTime,
        lapEndTime,
        lapEndRaceTime,
        lapPace,
        lapSpeed,
        totalDistance,
        averagePaceSinceRaceStart,
        averageSpeedSinceRaceStart,
      },
    });
  }

  return processedPassages;
}

/**
 * Returns processed time slots calculated from a list of passages
 * @param race
 * @param passages the list of passages sorted in ascending time order
 * @param timeSlotDuration the duration of time slots, in milliseconds
 */
export function getProcessedTimeSlotsFromPassages(
  race: PublicRace,
  passages: ProcessedPassage[],
  timeSlotDuration: number,
): RunnerProcessedTimeSlot[] {
  const timeSlots: RunnerProcessedTimeSlot[] = [];

  const raceStartTime = new Date(race.startTime);
  const raceDurationMs = race.duration * 1000;

  for (
    let timeSlotStartRaceTime = 0;
    timeSlotStartRaceTime < raceDurationMs;
    timeSlotStartRaceTime += timeSlotDuration
  ) {
    const timeSlotEndRaceTime = Math.min(timeSlotStartRaceTime + timeSlotDuration - 1, raceDurationMs - 1);
    const timeSlotStartTime = new Date(raceStartTime.getTime() + timeSlotStartRaceTime);
    const timeSlotEndTime = new Date(raceStartTime.getTime() + timeSlotEndRaceTime);

    const passagesInTimeSlot = getRunnerLapsInInterval(passages, timeSlotStartTime, timeSlotEndTime);

    let averageSpeed = null;
    let averagePace = null;

    if (passagesInTimeSlot.length > 0) {
      averageSpeed = getAverageSpeedInInterval(passagesInTimeSlot, timeSlotStartTime, timeSlotEndTime);
      averagePace = getPaceFromSpeed(averageSpeed);
    }

    const timeSlot: RunnerProcessedTimeSlot = {
      startTime: timeSlotStartTime,
      startRaceTime: timeSlotStartRaceTime,
      endTime: timeSlotEndTime,
      endRaceTime: timeSlotEndRaceTime,
      passages: passagesInTimeSlot,
      averageSpeed,
      averagePace,
    };

    timeSlots.push(timeSlot);
  }

  return timeSlots;
}

export function getFastestLapPassage<TPassage extends ProcessedPassage = ProcessedPassage>(
  passages: TPassage[],
): TPassage | null {
  let fastestLapPassage: TPassage | null = null;

  for (const passage of passages) {
    if (passage.processed.lapNumber === null) {
      continue;
    }

    if (fastestLapPassage === null) {
      fastestLapPassage = passage;
      continue;
    }

    if (passage.processed.lapDuration < fastestLapPassage.processed.lapDuration) {
      fastestLapPassage = passage;
    }
  }

  return fastestLapPassage;
}

export function getSlowestLapPassage<TPassage extends ProcessedPassage = ProcessedPassage>(
  passages: TPassage[],
): TPassage | null {
  let slowestLapPassage: TPassage | null = null;

  for (const passage of passages) {
    if (passage.processed.lapNumber === null) {
      continue;
    }

    if (slowestLapPassage === null) {
      slowestLapPassage = passage;
      continue;
    }

    if (passage.processed.lapDuration > slowestLapPassage.processed.lapDuration) {
      slowestLapPassage = passage;
    }
  }

  return slowestLapPassage;
}

/**
 * @param passages
 * @param intervalStart
 * @param intervalEnd
 * @return Passages that are entirely or partially in the interval
 */
function getRunnerLapsInInterval<TPassage extends ProcessedPassage = ProcessedPassage>(
  passages: TPassage[],
  intervalStart: Date,
  intervalEnd: Date,
): TPassage[] {
  return passages.filter((passage) => {
    // lap END time is BEFORE interval
    if (passage.processed.lapEndTime.getTime() <= intervalStart.getTime()) {
      return false;
    }

    // lap START time is AFTER interval
    if (passage.processed.lapStartTime.getTime() > intervalEnd.getTime()) {
      return false;
    }

    return true;
  });
}

function getAverageSpeedInInterval(passages: ProcessedPassage[], intervalStart: Date, intervalEnd: Date): number {
  let speedSum = 0;
  let durationSum = 0;

  for (const passage of passages) {
    const lapStartsInInterval = passage.processed.lapStartTime.getTime() >= intervalStart.getTime();
    const lapEndsInInterval = passage.processed.lapEndTime.getTime() - 1 <= intervalEnd.getTime();

    let lapDurationOutsideInterval = 0; // in ms

    if (!lapStartsInInterval) {
      // If lap starts before interval
      lapDurationOutsideInterval += intervalStart.getTime() - passage.processed.lapStartTime.getTime();
    }

    if (!lapEndsInInterval) {
      // If lap ends after interval
      lapDurationOutsideInterval += passage.processed.lapEndTime.getTime() - 1 - intervalEnd.getTime();
    }

    const lapDurationInInterval = passage.processed.lapDuration - lapDurationOutsideInterval;

    speedSum += passage.processed.lapSpeed * lapDurationInInterval;
    durationSum += lapDurationInInterval;
  }

  return speedSum / durationSum;
}

/**
 * Estimates the time it took to reach the given distance by interpolating the nearest passages before and after the given distance
 *
 * @param distance The desired distance, in meters
 * @param passages The list of passages, in which the two passages closest to the requested distance will be searched for in order to approximate the race time
 * @param runnerTotalDistance The total distance covered by the runner in meters, used for the calculation if it's greater than the desired distance and if there is no passage beyond the desired distance
 * @param raceDuration The total race duration in seconds, used for calculation in the same way as `runnerTotalDistance`
 */
export function approximateTimeToDistance(
  distance: number,
  passages: ProcessedPassage[],
  runnerTotalDistance: number,
  raceDuration: number,
): {
  /**
   * If true, a passage has been found at the exact distance requested, so the time is not approximate but exact
   */
  exact: boolean;

  /**
   * The calculated race time, in milliseconds. Null if the runner has not reached the required distance
   */
  raceTime: number | null;
} {
  const sortedPassages = getSortedPassages(passages);

  let closestPassageBeforeDistance: (typeof passages)[number] | null = null;
  let closestPassageAfterDistance: (typeof passages)[number] | null = null;

  for (const passage of sortedPassages) {
    if (passage.processed.totalDistance === distance) {
      return {
        exact: true,
        raceTime: passage.processed.lapEndRaceTime,
      };
    }

    if (passage.processed.totalDistance > distance) {
      closestPassageAfterDistance = passage;
      break;
    }

    if (
      closestPassageBeforeDistance === null
      || closestPassageBeforeDistance.processed.totalDistance < passage.processed.totalDistance
    ) {
      closestPassageBeforeDistance = passage;
    }
  }

  if (closestPassageAfterDistance === null && runnerTotalDistance < distance) {
    return { exact: false, raceTime: null };
  }

  const beforeDistance = closestPassageBeforeDistance?.processed.totalDistance ?? 0;
  const beforeRaceTime = closestPassageBeforeDistance?.processed.lapEndRaceTime ?? 0;

  const afterDistance = closestPassageAfterDistance?.processed.totalDistance ?? runnerTotalDistance;
  const afterRaceTime = closestPassageAfterDistance?.processed.lapEndRaceTime ?? raceDuration * 1000;

  const raceTime =
    beforeRaceTime
    + (afterRaceTime - beforeRaceTime) * ((distance - beforeDistance) / (afterDistance - beforeDistance));

  return { exact: false, raceTime };
}
