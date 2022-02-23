import {app} from "../../App";
import {useMemo} from "react";
import Util from "../../../util/Util";

const RunnerDetailsStats = ({runner}) => {
    console.log(runner);

    /**
     * Number of complete laps
     * @type {number}
     */
    const completeLapCount = useMemo(() => {
        return Math.max(0, runner.passages.length - 1);
    }, [runner]);

    /**
     * Total runner distance in meters
     * @type {number}
     */
    const totalDistance = useMemo(() => {
        if (runner.passages.length >= 1) {
            return app.state.firstLapDistance + app.state.lapDistance * (runner.passages.length - 1);
        }

        return 0;
    }, [runner]);

    /**
     * Last runner passage date
     * @type {Date|null}
     */
    const lastPassageDate = useMemo(() => {
        if (runner.passages.length <= 0) {
            return null;
        }

        return new Date(runner.passages[runner.passages.length - 1].time);
    }, [runner]);

    /**
     * Fastest lap passage of the runner
     * @type {object|null}
     */
    const fastestLapPassage = useMemo(() => {
        let fastestLapPassage = null;

        runner.passages.forEach(passage => {
            if (passage.processed.lapNumber === null) {
                return;
            }

            if (fastestLapPassage === null) {
                fastestLapPassage = passage;
                return;
            }

            if (passage.processed.lapDuration < fastestLapPassage.processed.lapDuration) {
                fastestLapPassage = passage;
            }
        });

        return fastestLapPassage;
    }, [runner]);

    /**
     * Slowest lap passage of the runner
     * @type {object|null}
     */
    const slowestLapPassage = useMemo(() => {
        let slowestLapPassage = null;

        runner.passages.forEach(passage => {
            if (passage.processed.lapNumber === null) {
                return;
            }

            if (fastestLapPassage === null) {
                slowestLapPassage = passage;
                return;
            }

            if (passage.processed.lapDuration > fastestLapPassage.processed.lapDuration) {
                slowestLapPassage = passage;
            }
        });

        return slowestLapPassage;
    }, [runner]);

    console.log('FASTEST', fastestLapPassage);
    console.log('SLOWEST', slowestLapPassage);

    /**
     * Last runner passage race time in ms
     * @type {number|null}
     */
    const lastPassageRaceTime = useMemo(() => {
        if (lastPassageDate === null) {
            return null;
        }

        return lastPassageDate.getTime() - app.state.raceStartTime.getTime();
    }, [lastPassageDate]);

    /**
     * Total runner average speed
     * @type {number|null}
     */
    const averageSpeed = useMemo(() => {
        if (lastPassageRaceTime === null) {
            return null;
        }

        //                  m/ms                     m/s    km/h
        return totalDistance / lastPassageRaceTime * 1000 * 3.6;
    }, [totalDistance, lastPassageRaceTime]);

    /**
     * Total runner average pace in ms/km
     * @type {number|null}
     */
    const averagePace = useMemo(() => {
        if (averageSpeed === null) {
            return null;
        }

        return (1 / (averageSpeed / 60)) * 60 * 1000;
    }, [averageSpeed]);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Données générales</h2>

                <p>
                    Distance tour : <strong>{app.state.lapDistance} m</strong> (premier tour : {app.state.firstLapDistance} m)
                </p>

                <p>
                    Nombre de tours complets : <strong>{completeLapCount}</strong>, distance totale : <strong>{(totalDistance / 1000).toFixed(3)} km</strong>
                </p>

                <p>
                    Tour le plus rapide : {(() => {
                    if (fastestLapPassage === null) {
                        return 'n/a';
                    }

                    return (
                        <>
                            Tour {fastestLapPassage.processed.lapNumber} à <strong>{Util.formatMsAsDuration(fastestLapPassage.processed.lapEndRaceTime)}</strong> de course,
                            durée : <strong>{Util.formatMsAsDuration(fastestLapPassage.processed.lapDuration)}</strong>,
                            vitesse : <strong>{fastestLapPassage.processed.lapSpeed.toFixed(2)} km/h</strong>,
                            allure : <strong>{Util.formatMsAsDuration(fastestLapPassage.processed.lapPace, false)}/km</strong>
                        </>
                    );
                })()}
                </p>

                <p>
                    Tour le plus lent : {(() => {
                    if (slowestLapPassage === null) {
                        return 'n/a';
                    }

                    return (
                        <>
                            Tour {slowestLapPassage.processed.lapNumber} à <strong>{Util.formatMsAsDuration(slowestLapPassage.processed.lapEndRaceTime)}</strong> de course,
                            durée : <strong>{Util.formatMsAsDuration(slowestLapPassage.processed.lapDuration)}</strong>,
                            vitesse : <strong>{slowestLapPassage.processed.lapSpeed.toFixed(2)} km/h</strong>,
                            allure : <strong>{Util.formatMsAsDuration(slowestLapPassage.processed.lapPace, false)}/km</strong>
                        </>
                    );
                })()}
                </p>

                <p>
                    Vitesse moyenne de 00:00:00 à {lastPassageRaceTime !== null ? Util.formatMsAsDuration(lastPassageRaceTime) : '--:--:--'} : <strong>{averageSpeed !== null ? averageSpeed.toFixed(2) + ' km/h' : 'n/a'}</strong> (allure moyenne : {averagePace !== null ? Util.formatMsAsDuration(averagePace, false) + '/km' : 'n/a'})
                </p>
            </div>
        </div>
    )
}

export default RunnerDetailsStats;
