import { ONE_HOUR_IN_MILLISECONDS } from "@live24hisere/core/constants";
import type {
  Participant,
  ProcessedPassage,
  PublicPassage,
  PublicRace,
  RaceRunner,
  RunnerProcessedData,
  RunnerProcessedHour,
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
 * Returns processed hours calculated from a list of passages
 * @param race
 * @param passages the list of passages sorted in ascending time order
 */
export function getProcessedHoursFromPassages(race: PublicRace, passages: ProcessedPassage[]): RunnerProcessedHour[] {
  const hours: RunnerProcessedHour[] = [];

  const raceStartTime = new Date(race.startTime);
  const raceDurationMs = race.duration * 1000 - 1; // - 1 to not create an hour of 1 ms

  for (let hourStartRaceTime = 0; hourStartRaceTime <= raceDurationMs; hourStartRaceTime += ONE_HOUR_IN_MILLISECONDS) {
    const hourEndRaceTime = Math.min(hourStartRaceTime + ONE_HOUR_IN_MILLISECONDS - 1, raceDurationMs);
    const hourStartTime = new Date(raceStartTime.getTime() + hourStartRaceTime);
    const hourEndTime = new Date(raceStartTime.getTime() + hourEndRaceTime);

    const passagesInHour = getRunnerLapsInInterval(passages, hourStartTime, hourEndTime);

    let averageSpeed = null;
    let averagePace = null;

    if (passagesInHour.length > 0) {
      averageSpeed = getAverageSpeedInInterval(passagesInHour, hourStartTime, hourEndTime);
      averagePace = getPaceFromSpeed(averageSpeed);
    }

    const hour: RunnerProcessedHour = {
      startTime: hourStartTime,
      startRaceTime: hourStartRaceTime,
      endTime: hourEndTime,
      endRaceTime: hourEndRaceTime,
      passages: passagesInHour,
      averageSpeed,
      averagePace,
    };

    hours.push(hour);
  }

  return hours;
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
export function getRunnerLapsInInterval<TPassage extends ProcessedPassage = ProcessedPassage>(
  passages: TPassage[],
  intervalStart: Date,
  intervalEnd: Date,
): TPassage[] {
  return passages.filter((passage) => {
    // lap END time is BEFORE interval
    if (passage.processed.lapEndTime.getTime() < intervalStart.getTime()) {
      return false;
    }

    // lap START time is AFTER interval
    if (passage.processed.lapStartTime.getTime() > intervalEnd.getTime()) {
      return false;
    }

    return true;
  });
}

export function getAverageSpeedInInterval(
  passages: ProcessedPassage[],
  intervalStart: Date,
  intervalEnd: Date,
): number {
  let speedSum = 0;
  let durationSum = 0;

  for (const passage of passages) {
    const lapStartsInInterval = passage.processed.lapStartTime.getTime() >= intervalStart.getTime();
    const lapEndsInInterval = passage.processed.lapEndTime.getTime() <= intervalEnd.getTime();

    let lapDurationOutsideInterval = 0; // in ms

    if (!lapStartsInInterval) {
      // If lap starts before interval
      lapDurationOutsideInterval += intervalStart.getTime() - passage.processed.lapStartTime.getTime();
    }

    if (!lapEndsInInterval) {
      // If lap ends after interval
      lapDurationOutsideInterval += passage.processed.lapEndTime.getTime() - intervalEnd.getTime();
    }

    const lapDurationInInterval = passage.processed.lapDuration - lapDurationOutsideInterval;

    speedSum += passage.processed.lapSpeed * lapDurationInInterval;
    durationSum += lapDurationInInterval;
  }

  return speedSum / durationSum;
}
