import {Race} from "../types/Race";
import Util from "./Util";
import {
    RunnerProcessedHour,
    RunnerWithProcessedPassages
} from "../types/Runner";
import Passage, {PassageProcessedData, ProcessedPassage} from "../types/Passage";

class RunnerDetailsUtil {
    /**
     * @param passages Passages sorted by ascending time
     * @param race
     */
    static getRunnerProcessedPassages = <T extends Passage>(passages: T[], race: Race): (T & {processed: PassageProcessedData})[] => {
        let totalDistance = 0;

        const processedPassages: (T & {processed: PassageProcessedData})[] = [];

        for (let i = 0; i < passages.length; ++i) {
            const previousPassage = i > 0 ? passages[i-1] : null
            const passage = passages[i];

            const lapNumber = i === 0 ? null : i; // The first passage is an incomplete lap, so it's not counted

            const lapDistance = i === 0 ? race.initialDistance : race.lapDistance;
            const lapStartTime = i === 0 ? new Date(race.startTime) : new Date((previousPassage as Passage).time);
            const lapEndTime = new Date(passage.time);

            totalDistance += lapDistance;

            if (isNaN(lapStartTime.getTime())) {
                throw new Error("Invalid passage start time");
            }

            if (isNaN(lapEndTime.getTime())) {
                throw new Error("Invalid passage end time");
            }

            const raceStartTime = new Date(race.startTime);

            const lapStartRaceTime = lapStartTime.getTime() - raceStartTime.getTime();
            const lapEndRaceTime = lapEndTime.getTime() - raceStartTime.getTime();
            const lapDuration = lapEndRaceTime - lapStartRaceTime;

            const lapSpeed = lapDistance / lapDuration * 1000 * 3.6;
            const lapPace = RunnerDetailsUtil.getPaceFromSpeed(lapSpeed);

            const averageSpeedSinceRaceStart = totalDistance / lapEndRaceTime * 1000 * 3.6;
            const averagePaceSinceRaceStart = RunnerDetailsUtil.getPaceFromSpeed(averageSpeedSinceRaceStart);

            const passageProcessedData: PassageProcessedData = {
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
            }

            processedPassages.push({
                ...structuredClone(passage),
                processed: passageProcessedData,
            });
        }

        return processedPassages;
    }

    static getRunnerProcessedHours = (runner: RunnerWithProcessedPassages, race: Race): RunnerProcessedHour[] => {
        const hourDuration = 60 * 60 * 1000; // in ms

        const hours: RunnerProcessedHour[] = [];

        const raceStartTime = new Date(race.startTime);
        const raceDurationMs = race.duration * 1000 - 1; // - 1 to not create an hour of 1 ms

        for (let hourStartRaceTime = 0; hourStartRaceTime <= raceDurationMs; hourStartRaceTime += hourDuration) {
            const hourEndRaceTime = Math.min(hourStartRaceTime + hourDuration - 1, raceDurationMs);
            const hourStartTime = new Date(raceStartTime.getTime() + hourStartRaceTime);
            const hourEndTime = new Date(raceStartTime.getTime() + hourEndRaceTime);

            const passages = RunnerDetailsUtil.getLapsInRaceTimeInterval(runner.passages, hourStartRaceTime, hourEndRaceTime);

            let averageSpeed = null;
            let averagePace = null;

            if (passages.length > 0) {
                const {speed, pace} = RunnerDetailsUtil.getSpeedAndPaceInHour(
                    passages,
                    hourStartRaceTime,
                    hourEndRaceTime,
                );

                averageSpeed = speed;
                averagePace = pace;
            }

            const hour: RunnerProcessedHour = {
                startTime: hourStartTime,
                startRaceTime: hourStartRaceTime,
                endTime: hourEndTime,
                endRaceTime: hourEndRaceTime,
                passages,
                averageSpeed,
                averagePace,
            };

            hours.push(hour);
        }

        return hours;
    }

    /**
     * Calculates a pace from a speed
     * @param speed the speed in km/h
     * @return {number} the corresponding pace in ms/km
     */
    static getPaceFromSpeed = (speed: number): number => {
        return (1 / (speed / 60)) * 60 * 1000;
    }

    /**
     * Returns runner data ready for excel export
     */
    static getDataForExcelExport = (runner: RunnerWithProcessedPassages): object[] => {
        const excelData: object[] = [];

        runner.passages.forEach(passage => {
            excelData.push({
                "Tours": passage.processed.lapNumber,
                "Temps total": Util.formatMsAsDuration(passage.processed.lapEndRaceTime),
                "Temps total (s)": Math.round(passage.processed.lapEndRaceTime / 1000),
                "Distance totale (m)": passage.processed.totalDistance,
                "Temps tour": Util.formatMsAsDuration(passage.processed.lapDuration, false),
                "Temps tour (s)": Math.round(passage.processed.lapDuration / 1000),
                "Distance tour (m)": passage.processed.lapDistance,
                "Vitesse tour (km/h)": passage.processed.lapSpeed,
                "Allure tour (min/km)": Util.formatMsAsDuration(passage.processed.lapPace, false),
                "Vitesse moyenne depuis départ (km/h)": passage.processed.averageSpeedSinceRaceStart,
                "Allure moyenne depuis départ (min/km)": Util.formatMsAsDuration(passage.processed.averagePaceSinceRaceStart, false),
            });
        });

        return excelData;
    }

    private static getLapsInRaceTimeInterval = (
        passages: ProcessedPassage[],
        intervalStartRaceTime: number,
        intervalEndRaceTime: number
    ): ProcessedPassage[] => {
        return passages.filter(passage => {

            // lap END time is BEFORE interval
            if (passage.processed.lapEndRaceTime < intervalStartRaceTime) {
                return false;
            }

            // lap START time is AFTER interval
            if (passage.processed.lapStartRaceTime > intervalEndRaceTime) {
                return false;
            }

            return true;
        });
    }

    private static getSpeedAndPaceInHour = (
        passages: ProcessedPassage[],
        hourStartRaceTime: number,
        hourEndRaceTime: number
    ): {speed: number, pace: number} => {
        let speedSum = 0;
        let durationSum = 0;

        passages.forEach(passage => {
            const lapStartsInHour = passage.processed.lapStartRaceTime >= hourStartRaceTime;
            const lapEndsInHour = passage.processed.lapEndRaceTime <= hourEndRaceTime;

            let lapDurationOutsideHour = 0;

            if (!lapStartsInHour) { // If lap starts before hour
                lapDurationOutsideHour += hourStartRaceTime - passage.processed.lapStartRaceTime;
            }

            if (!lapEndsInHour) { // If lap ends after hour
                lapDurationOutsideHour += passage.processed.lapEndRaceTime - hourEndRaceTime;
            }

            const lapDurationInHour = passage.processed.lapDuration - lapDurationOutsideHour;

            speedSum += passage.processed.lapSpeed * lapDurationInHour;
            durationSum += lapDurationInHour;
        });

        const speed = speedSum / durationSum;
        const pace = RunnerDetailsUtil.getPaceFromSpeed(speed);

        return {speed, pace};
    }
}

export default RunnerDetailsUtil;
