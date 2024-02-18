import { HOUR_IN_MS } from "../constants/misc";
import { getPaceFromSpeed, getSpeed } from "./mathUtils";
import { getDistanceFromPassageCount, getRaceTime } from "./raceUtils";
import { type Passage, type PassageProcessedData, type ProcessedPassage } from "../types/Passage";
import { type Race } from "../types/Race";
import { type RunnerProcessedData, type RunnerProcessedHour } from "../types/Runner";
import { spaceship } from "./compareUtils";
import { isDateValid } from "./utils";

/**
 * Returns passages sorted in ascending time order
 */
export function getSortedPassages<T extends Passage>(passages: T[]): T[] {
    return passages.toSorted((passageA, passageB) => spaceship(
        new Date(passageA.time).getTime(),
        new Date(passageB.time).getTime(),
    ));
}

export function getRunnerProcessedDataFromPassages(race: Race, passages: Passage[]): RunnerProcessedData {
    if (!passages.length) {
        return {
            lastPassageTime: null,
            averageSpeed: null,
            averagePace: null,
            distance: 0,
        };
    }

    const lastPassageTimeDate = new Date(passages[passages.length - 1].time);

    const lastPassageTime: RunnerProcessedData["lastPassageTime"] = {
        time: lastPassageTimeDate,
        raceTime: getRaceTime(race, lastPassageTimeDate),
    };

    const distance = getDistanceFromPassageCount(race, passages.length);

    const averageSpeed = getSpeed(distance, lastPassageTime.raceTime);
    const averagePace = getPaceFromSpeed(averageSpeed);

    return {
        lastPassageTime,
        distance,
        averageSpeed,
        averagePace,
    };
}

export function getProcessedPassagesFromPassages<T extends Passage>(race: Race, passages: T[]): Array<T & { processed: PassageProcessedData }> {
    const raceInitialDistance = Number(race.initialDistance);
    const raceLapDistance = Number(race.lapDistance);

    const processedPassages: Array<T & { processed: PassageProcessedData }> = [];

    let totalDistance = 0;

    for (let i = 0; i < passages.length; ++i) {
        const isFirstPassage = i === 0;

        const passage = passages[i];
        const previousPassage = isFirstPassage ? null : passages[i - 1];

        let lapNumber: number | null;

        if (raceInitialDistance <= 0) {
            lapNumber = i + 1;
        } else {
            lapNumber = isFirstPassage ? null : i; // The first passage is an incomplete lap, so it's not counted
        }

        const lapDistance = lapNumber === null ? raceInitialDistance : raceLapDistance;
        const lapStartTime = previousPassage ? new Date(previousPassage.time) : new Date(race.startTime);
        const lapEndTime = new Date(passage.time);

        if (!isDateValid(lapStartTime)) {
            throw new Error("Invalid passage start time");
        }

        if (!isDateValid(lapEndTime)) {
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
export function getProcessedHoursFromPassages(race: Race, passages: ProcessedPassage[]): RunnerProcessedHour[] {
    const hours: RunnerProcessedHour[] = [];

    const raceStartTime = new Date(race.startTime);
    const raceDurationMs = race.duration * 1000 - 1; // - 1 to not create an hour of 1 ms

    for (let hourStartRaceTime = 0; hourStartRaceTime <= raceDurationMs; hourStartRaceTime += HOUR_IN_MS) {
        const hourEndRaceTime = Math.min(hourStartRaceTime + HOUR_IN_MS - 1, raceDurationMs);
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

/**
 * @param passages
 * @param intervalStart
 * @param intervalEnd
 * @return Passages that are entirely or partially in the interval
 */
export function getRunnerLapsInInterval<T extends ProcessedPassage = ProcessedPassage>(
    passages: T[],
    intervalStart: Date,
    intervalEnd: Date,
): T[] {
    return passages.filter(passage => {
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

export function getAverageSpeedInInterval(passages: ProcessedPassage[], intervalStart: Date, intervalEnd: Date): number {
    let speedSum = 0;
    let durationSum = 0;

    for (const passage of passages) {
        const lapStartsInInterval = passage.processed.lapStartTime.getTime() >= intervalStart.getTime();
        const lapEndsInInterval = passage.processed.lapEndTime.getTime() <= intervalEnd.getTime();

        let lapDurationOutsideInterval = 0; // in ms

        if (!lapStartsInInterval) { // If lap starts before interval
            lapDurationOutsideInterval += intervalStart.getTime() - passage.processed.lapStartTime.getTime();
        }

        if (!lapEndsInInterval) { // If lap ends after interval
            lapDurationOutsideInterval += passage.processed.lapEndTime.getTime() - intervalEnd.getTime();
        }

        const lapDurationInInterval = passage.processed.lapDuration - lapDurationOutsideInterval;

        speedSum += passage.processed.lapSpeed * lapDurationInInterval;
        durationSum += lapDurationInInterval;
    }

    return speedSum / durationSum;
}
