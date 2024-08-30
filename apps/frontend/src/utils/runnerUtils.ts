import { type Passage, type PassageWithRunnerId } from "@live24hisere/types";
import { compareUtils, dateUtils } from "@live24hisere/utils";
import { type SelectOption } from "../types/Forms";
import { type RankingRunnerGap } from "../types/Ranking";
import {
    type Runner,
    type RunnerWithPassages,
    type RunnerWithProcessedData,
    type RunnerWithProcessedPassages,
} from "../types/Runner";
import { getSortedPassages } from "./passageUtils";
import { formatMsAsDuration } from "./utils";

export function getRunnersWithPassagesFromRunnersAndPassages<
    TRunner extends Runner,
    TPassage extends PassageWithRunnerId,
>(
    runners: TRunner[],
    passages: TPassage[],
): Array<RunnerWithPassages<TPassage>> {
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
        getRunnerWithPassagesFromRunnerAndPassages(
            runner,
            runnerPassages.get(runner.id) ?? [],
        ),
    );
}

export function getRunnerWithPassagesFromRunnerAndPassages<
    TRunner extends Runner,
    TPassage extends Passage,
>(runner: TRunner, passages: TPassage[]): TRunner & { passages: TPassage[] } {
    return {
        ...runner,
        passages: getSortedPassages(passages),
    };
}

/**
 * Computes the gap between two runners of a race
 * @param runner1 Must be the highest-ranking runner
 * @param runner2 Must be the lowest-ranking runner
 */
export function getGapBetweenRunners(
    runner1: RunnerWithProcessedPassages & RunnerWithProcessedData,
    runner2: RunnerWithProcessedPassages & RunnerWithProcessedData,
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
        const runner1LastPassage =
            runner1.passages[runner1.passages.length - 1];

        return {
            laps: runner1LastPassage.processed.lapNumber ?? 0,
            time: runner1LastPassage.processed.lapEndRaceTime,
        };
    }

    const passageCountDifference = runner1PassageCount - runner2PassageCount;

    const runner2LastPassage = runner2.passages[runner2.passages.length - 1];

    const runner1SameLapNumberPassage = runner1.passages.find(
        (passage) =>
            passage.processed.lapNumber ===
            runner2LastPassage.processed.lapNumber,
    );

    if (!runner1SameLapNumberPassage) {
        throw new Error("Runner 1");
    }

    const passageTimeGap =
        runner2LastPassage.processed.lapEndRaceTime -
        runner1SameLapNumberPassage.processed.lapEndRaceTime;

    return {
        laps: passageCountDifference,
        time: passageTimeGap,
    };
}

export function formatGap(
    gap: RankingRunnerGap | null,
    exhaustive: boolean = false,
): string | null {
    if (!gap) {
        return null;
    }

    if (gap.time === 0) {
        return "=";
    }

    const timeGap = `+${formatMsAsDuration(gap.time, false)}`;

    if (gap.laps === 0) {
        return timeGap;
    }

    const lapsGap = `+${gap.laps} ${gap.laps > 1 ? "tours" : "tour"}`;

    if (!exhaustive) {
        return lapsGap;
    }

    return `${lapsGap} (${timeGap})`;
}

/**
 * Compare two runners
 * Returns -1 if `runner1` is faster, 1 if `runner2` is faster and 0 if the runners are equal
 */
export function spaceshipRunners(
    runner1: RunnerWithPassages & RunnerWithProcessedData,
    runner2: RunnerWithPassages & RunnerWithProcessedData,
): ReturnType<typeof compareUtils.spaceship> {
    const runner1PassageCount = runner1.passages.length;
    const runner2PassageCount = runner2.passages.length;

    if (runner1PassageCount === runner2PassageCount) {
        // When two runners have completed the same number of laps,
        // the one who has completed them the fastest is considered to be faster than the other.
        return compareUtils.spaceship(
            runner1.lastPassageTime?.raceTime,
            runner2.lastPassageTime?.raceTime,
        );
    }

    return compareUtils.spaceship(runner2PassageCount, runner1PassageCount);
}

/**
 * Returns true if two runners are equal (same number of laps and last passage at the same time)
 */
export function areRunnersEqual(
    runner1: RunnerWithPassages & RunnerWithProcessedData,
    runner2: RunnerWithPassages & RunnerWithProcessedData,
): boolean {
    return spaceshipRunners(runner1, runner2) === 0;
}

/**
 * Returns an array of select options from an array of runners
 * @param runners
 * @param label an optional callback function to format the label
 */
export function getRunnersSelectOptions<T extends Runner>(
    runners: T[] | false,
    label?: (runner: T) => string,
): SelectOption[] {
    if (!runners) {
        return [];
    }

    return runners.map((runner) => ({
        label: label
            ? label(runner)
            : `N° ${runner.id} – ${runner.lastname.toUpperCase()} ${runner.firstname}`,
        value: runner.id,
    }));
}

/**
 * Returns runner data ready for excel export
 */
export function getDataForExcelExport(
    runner: RunnerWithProcessedPassages,
): object[] {
    const excelData: object[] = [];

    runner.passages.forEach((passage) => {
        excelData.push({
            Tours: passage.processed.lapNumber,
            "Temps total": formatMsAsDuration(passage.processed.lapEndRaceTime),
            "Temps total (s)": Math.round(
                passage.processed.lapEndRaceTime / 1000,
            ),
            "Distance totale (m)": passage.processed.totalDistance,
            "Temps tour": formatMsAsDuration(
                passage.processed.lapDuration,
                false,
            ),
            "Temps tour (s)": Math.round(passage.processed.lapDuration / 1000),
            "Distance tour (m)": passage.processed.lapDistance,
            "Vitesse tour (km/h)": passage.processed.lapSpeed,
            "Allure tour (min/km)": formatMsAsDuration(
                passage.processed.lapPace,
                false,
            ),
            "Vitesse moyenne depuis départ (km/h)":
                passage.processed.averageSpeedSinceRaceStart,
            "Allure moyenne depuis départ (min/km)": formatMsAsDuration(
                passage.processed.averagePaceSinceRaceStart,
                false,
            ),
        });
    });

    return excelData;
}
