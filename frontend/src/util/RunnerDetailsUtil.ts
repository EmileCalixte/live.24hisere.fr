import Util from "./Util";
import {app, RACE_DURATION} from "../components/App";
import {
    RunnerProcessedHour,
    RunnerWithPassages,
    RunnerWithProcessedHours,
    RunnerWithProcessedPassages
} from "../types/Runner";
import Passage, {PassageProcessedData, ProcessedPassage} from "../types/Passage";

class RunnerDetailsUtil {
    static getProcessedRunner = (runner: RunnerWithPassages): RunnerWithProcessedPassages & RunnerWithProcessedHours => {
        Util.verbose("Processing runner data");

        const runnerWithProcessedPassages = RunnerDetailsUtil.getRunnerWithProcessedPassages(runner);
        const processedRunner = RunnerDetailsUtil.getRunnerWithProcessedHours(runnerWithProcessedPassages);

        Util.verbose("Runner data processed");

        return processedRunner;
    }

    /**
     * Adds a `processed` object to each runner.passages entry, with following keys :
     * - `lapNumber`: the lap number (null if it's the first and incomplete lap)
     * - `lapDistance`: the lap distance in meters
     * - `totalDistance`: the total distance travelled at the time of passage in meters
     * - `lapStartTime`: a Date object representing the beginning of the lap
     * - `lapEndTime`: a Date object representing the end of the lap (it's the passage time)
     * - `lapStartRaceTime`: the elapsed race time since the beginning of the lap in ms
     * - `lapEndRaceTime`: the elapsed race time since the end of the lap in ms
     * - `lapDuration`: the duration of the lap in ms
     * - `lapSpeed`: the average speed of the lap in km/h
     * - `lapPace`: the average pace of the lap in ms/km
     * - `averageSpeedSinceRaceStart`: the average speed between the race start and the passage time in km/h
     * - `averagePaceSinceRaceStart`: the average pace between the race start and the passage time in ms/km
     * @param {object} runner
     */
    static getRunnerWithProcessedPassages = (runner: RunnerWithPassages): RunnerWithProcessedPassages => {
        let totalDistance = 0;

        const processedPassages: ProcessedPassage[] = [];

        for (let i = 0; i < runner.passages.length; ++i) {
            const previousPassage = i > 0 ? runner.passages[i-1] : null
            const passage = runner.passages[i];

            const lapNumber = i === 0 ? null : i; // The first passage is an incomplete lap, so it's not counted

            const lapDistance = i === 0 ? app.state.firstLapDistance : app.state.lapDistance;
            const lapStartTime = i === 0 ? app.state.raceStartTime : new Date((previousPassage as Passage).time);
            const lapEndTime = new Date(passage.time);

            totalDistance += lapDistance;

            if (isNaN(lapStartTime.getTime())) {
                throw new Error('Invalid passage start time');
            }

            if (isNaN(lapEndTime.getTime())) {
                throw new Error('Invalid passage end time');
            }

            const lapStartRaceTime = lapStartTime.getTime() - app.state.raceStartTime.getTime();
            const lapEndRaceTime = lapEndTime.getTime() - app.state.raceStartTime.getTime();
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

            const processedPassage: ProcessedPassage = {
                ...structuredClone(passage),
                processed: passageProcessedData,
            }

            processedPassages.push(processedPassage);
        }

        return {
            ...structuredClone(runner),
            passages: processedPassages,
        };
    }

    static getRunnerWithProcessedHours = (runner: RunnerWithProcessedPassages): RunnerWithProcessedPassages & RunnerWithProcessedHours => {

        const hourDuration = 60 * 60 * 1000; // in ms

        const hours: RunnerProcessedHour[] = [];

        for (let hourStartRaceTime = 0; hourStartRaceTime <= RACE_DURATION; hourStartRaceTime += hourDuration) {
            const hourEndRaceTime = Math.min(hourStartRaceTime + hourDuration - 1, RACE_DURATION);
            const hourStartTime = new Date(app.state.raceStartTime.getTime() + hourStartRaceTime);
            const hourEndTime = new Date(app.state.raceStartTime.getTime() + hourEndRaceTime);

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

        return {
            ...structuredClone(runner),
            hours: hours,
        };
    }

    static getLapsInRaceTimeInterval = (passages: ProcessedPassage[], intervalStartRaceTime: number, intervalEndRaceTime: number) => {
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

    static getSpeedAndPaceInHour = (
        passages: ProcessedPassage[],
        hourStartRaceTime: number,
        hourEndRaceTime: number): {speed: number, pace: number} => {
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
}

export default RunnerDetailsUtil;
