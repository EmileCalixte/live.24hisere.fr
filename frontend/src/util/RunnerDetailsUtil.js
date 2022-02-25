import Util from "./Util";
import {app, RACE_DURATION} from "../components/App";

class RunnerDetailsUtil {
    static processRunnerData = (runner) => {
        RunnerDetailsUtil.processRunnerPassages(runner);
        RunnerDetailsUtil.processRunnerHourlyAverageSpeed(runner);
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
    static processRunnerPassages = (runner) => {
        Util.verbose('Processing passages');

        let totalDistance = 0;
        for (let i = 0; i < runner.passages.length; ++i) {
            const previousPassage = i > 0 ? runner.passages[i-1] : null
            const passage = runner.passages[i];
            passage.processed = {};

            passage.processed.lapNumber = i === 0 ? null : i; // The first passage is an incomplete lap, so it's not counted

            passage.processed.lapDistance = i === 0 ? app.state.firstLapDistance : app.state.lapDistance;
            passage.processed.lapStartTime = i === 0 ? app.state.raceStartTime : new Date(previousPassage.time);
            passage.processed.lapEndTime = new Date(passage.time);

            totalDistance += passage.processed.lapDistance;
            passage.processed.totalDistance = totalDistance;

            if (isNaN(passage.processed.lapStartTime)) {
                throw new Error('Invalid passage start time');
            }

            if (isNaN(passage.processed.lapEndTime)) {
                throw new Error('Invalid passage end time');
            }

            passage.processed.lapStartRaceTime = passage.processed.lapStartTime.getTime() - app.state.raceStartTime.getTime();
            passage.processed.lapEndRaceTime = passage.processed.lapEndTime.getTime() - app.state.raceStartTime.getTime();
            passage.processed.lapDuration = passage.processed.lapEndRaceTime - passage.processed.lapStartRaceTime;

            passage.processed.lapSpeed = passage.processed.lapDistance / passage.processed.lapDuration * 1000 * 3.6;
            passage.processed.lapPace = (1 / (passage.processed.lapSpeed / 60)) * 60 * 1000;

            passage.processed.averageSpeedSinceRaceStart = passage.processed.totalDistance / passage.processed.lapEndRaceTime * 1000 * 3.6;
            passage.processed.averagePaceSinceRaceStart = (1 / (passage.processed.averageSpeedSinceRaceStart / 60)) * 60 * 1000;
        }

        Util.verbose('Passages processed');
    }

    /**
     * @param {object} runner a runner with processed passages
     */
    static processRunnerHourlyAverageSpeed = (runner) => {
        const hourDuration = 60 * 60 * 1000; // in ms

        const hours = [];

        for (let hourStartRaceTime = 0; hourStartRaceTime <= RACE_DURATION; hourStartRaceTime += hourDuration) {
            const hourEndRaceTime = Math.min(hourStartRaceTime + hourDuration - 1, RACE_DURATION);
            const hourStartTime = new Date(app.state.raceStartTime.getTime() + hourStartRaceTime);
            const hourEndTime = new Date(app.state.raceStartTime.getTime() + hourEndRaceTime);

            hours.push({
                hourStartRaceTime,
                hourEndRaceTime,
                hourStartTime,
                hourEndTime,
                passages: RunnerDetailsUtil.getLapsInRaceTimeInterval(runner.passages, hourStartRaceTime, hourEndRaceTime),
            });
        }

        console.log('HOURS', hours);
    }

    static getLapsInRaceTimeInterval = (passages, intervalStartRaceTime, intervalEndRaceTime) => {
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
}

export default RunnerDetailsUtil;
