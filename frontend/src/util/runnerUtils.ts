import { type Passage, type PassageWithRunnerId } from "../types/Passage";
import {
    type Runner,
    type RunnerWithPassageCount,
    type RunnerWithPassages,
    type RunnerWithProcessedData,
    type RunnerWithProcessedPassages,
} from "../types/Runner";
import { spaceship } from "./compareUtils";
import { getSortedPassages } from "./passageUtils";
import { formatMsAsDuration, isDateValid } from "./utils";

export function getRunnersWithPassagesFromRunnersAndPassages<T extends Runner, U extends PassageWithRunnerId>(
    runners: T[],
    passages: U[],
): Array<T & { passages: U[] }> {
    /**
     * A map with runner ID as key and array of passages as value
     */
    const runnerPassages = new Map<number, U[]>();

    for (const passage of passages) {
        const passageTime = new Date(passage.time);

        if (!isDateValid(passageTime)) {
            continue;
        }

        if (runnerPassages.has(passage.runnerId)) {
            runnerPassages.get(passage.runnerId)?.push(passage);
        } else {
            runnerPassages.set(passage.runnerId, [passage]);
        }
    }

    return runners.map(runner => getRunnerWithPassagesFromRunnerAndPassages(
        runner,
        runnerPassages.get(runner.id) ?? [],
    ));
}

export function getRunnerWithPassagesFromRunnerAndPassages<T extends Runner, U extends Passage>(
    runner: T,
    passages: U[],
): T & { passages: U[] } {
    return {
        ...runner,
        passages: getSortedPassages(passages),
    };
}

/**
 * Compare two runners
 * Returns -1 if `runner1` is faster, 1 if `runner2` is faster and 0 if the runners are equal
 */
export function spaceshipRunners(
    runner1: (RunnerWithPassages | RunnerWithPassageCount) & RunnerWithProcessedData,
    runner2: (RunnerWithPassages | RunnerWithPassageCount) & RunnerWithProcessedData,
): ReturnType<typeof spaceship> {
    const runner1PassageCount = "passageCount" in runner1 ? runner1.passageCount : runner1.passages.length;
    const runner2PassageCount = "passageCount" in runner2 ? runner2.passageCount : runner2.passages.length;

    if (runner1PassageCount === runner2PassageCount) {
        // When two runners have completed the same number of laps,
        // the one who has completed them the fastest is considered to be faster than the other.
        return spaceship(runner1.lastPassageTime?.raceTime, runner2.lastPassageTime?.raceTime);
    }

    return spaceship(runner2PassageCount, runner1PassageCount);
}

/**
 * Returns true if two runners are equal (same number of laps and last passage at the same time)
 */
export function areRunnersEqual(
    runner1: (RunnerWithPassages | RunnerWithPassageCount) & RunnerWithProcessedData,
    runner2: (RunnerWithPassages | RunnerWithPassageCount) & RunnerWithProcessedData,
): boolean {
    return spaceshipRunners(runner1, runner2) === 0;
}

/**
 * Returns runner data ready for excel export
 */
export function getDataForExcelExport(runner: RunnerWithProcessedPassages): object[] {
    const excelData: object[] = [];

    runner.passages.forEach(passage => {
        excelData.push({
            Tours: passage.processed.lapNumber,
            "Temps total": formatMsAsDuration(passage.processed.lapEndRaceTime),
            "Temps total (s)": Math.round(passage.processed.lapEndRaceTime / 1000),
            "Distance totale (m)": passage.processed.totalDistance,
            "Temps tour": formatMsAsDuration(passage.processed.lapDuration, false),
            "Temps tour (s)": Math.round(passage.processed.lapDuration / 1000),
            "Distance tour (m)": passage.processed.lapDistance,
            "Vitesse tour (km/h)": passage.processed.lapSpeed,
            "Allure tour (min/km)": formatMsAsDuration(passage.processed.lapPace, false),
            "Vitesse moyenne depuis départ (km/h)": passage.processed.averageSpeedSinceRaceStart,
            "Allure moyenne depuis départ (min/km)": formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, false),
        });
    });

    return excelData;
}
