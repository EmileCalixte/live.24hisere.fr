import { type ProcessedPassage } from "../types/Passage";

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
