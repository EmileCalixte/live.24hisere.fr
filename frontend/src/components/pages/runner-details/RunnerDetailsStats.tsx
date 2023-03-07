import {type Race} from "../../../types/Race";
import {type RankingRunnerRanks} from "../../../types/Ranking";
import React, {type FunctionComponent, useMemo} from "react";
import CircularLoader from "../../misc/CircularLoader";
import SpeedChart from "./charts/SpeedChart";
import Util from "../../../util/Util";
import RunnerDetailsUtil from "../../../util/RunnerDetailsUtil";
import {type RunnerWithProcessedHours, type RunnerWithProcessedPassages} from "../../../types/Runner";
import {type ProcessedPassage} from "../../../types/Passage";

interface RunnerDetailsStatsProps {
    runner: RunnerWithProcessedPassages & RunnerWithProcessedHours;
    race: Race;
    ranks: RankingRunnerRanks | null;
}

const RunnerDetailsStats: FunctionComponent<RunnerDetailsStatsProps> = ({
    runner,
    race,
    ranks,
}) => {
    const completeLapCount = useMemo<number>(() => {
        return Math.max(0, runner.passages.length - 1);
    }, [runner]);

    /** Total distance in meters */
    const totalDistance = useMemo<number>(() => {
        if (runner.passages.length >= 1) {
            return race.initialDistance + race.lapDistance * (runner.passages.length - 1);
        }

        return 0;
    }, [race, runner]);

    const lastPassageDate = useMemo<Date | null>(() => {
        if (runner.passages.length <= 0) {
            return null;
        }

        return new Date(runner.passages[runner.passages.length - 1].time);
    }, [runner]);

    const fastestLapPassage = useMemo<ProcessedPassage | null>(() => {
        let fastestLapPassage: ProcessedPassage | null = null;

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

    const slowestLapPassage = useMemo<ProcessedPassage | null>(() => {
        let slowestLapPassage: ProcessedPassage | null = null;

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
    }, [runner, fastestLapPassage]);

    /** Last runner passage race time in ms */
    const lastPassageRaceTime = useMemo<number | null>(() => {
        if (lastPassageDate === null) {
            return null;
        }

        return lastPassageDate.getTime() - new Date(race.startTime).getTime();
    }, [race, lastPassageDate]);

    /** Total runner average speed in km/h */
    const averageSpeed = useMemo<number | null>(() => {
        if (lastPassageRaceTime === null) {
            return null;
        }

        //                  m/ms                     m/s    km/h
        return totalDistance / lastPassageRaceTime * 1000 * 3.6;
    }, [totalDistance, lastPassageRaceTime]);

    /** Total runner average pace in ms/km */
    const averagePace = useMemo<number | null>(() => {
        if (averageSpeed === null) {
            return null;
        }

        return RunnerDetailsUtil.getPaceFromSpeed(averageSpeed);
    }, [averageSpeed]);

    return (
        <div className="row">
            <div className="col-12">
                <h2>Données générales</h2>

                <p>
                    Classement : {!ranks && <CircularLoader/>}

                    {ranks &&
                        <span>
                            <b>{ranks.displayed.scratchMixed}</b>
                            &nbsp;|&nbsp;
                            {ranks.displayed.scratchGender} {runner.gender.toUpperCase()}
                            &nbsp;|&nbsp;
                            {ranks.displayed.categoryMixed} {runner.category.toUpperCase()}
                            &nbsp;|&nbsp;
                            {ranks.displayed.categoryGender} {runner.category.toUpperCase()}-{runner.gender.toUpperCase()}
                        </span>
                    }
                </p>

                <p>
                    Nombre de tours complets : <strong>{completeLapCount}</strong>, distance totale : <strong>{(totalDistance / 1000).toFixed(3)} km</strong>
                </p>

                <p>
                    Tour le plus rapide : {(() => {
                        if (fastestLapPassage === null) {
                            return "n/a";
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
                            return "n/a";
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
                    Vitesse moyenne de 00:00:00 à {lastPassageRaceTime !== null ? Util.formatMsAsDuration(lastPassageRaceTime) : "--:--:--"} : <strong>{averageSpeed !== null ? averageSpeed.toFixed(2) + " km/h" : "n/a"}</strong> (allure moyenne : <strong>{averagePace !== null ? Util.formatMsAsDuration(averagePace, false) + "/km" : "n/a"})</strong>
                </p>
            </div>

            {averageSpeed !== null &&
                <div className="col-12">
                    <h2>Vitesse</h2>

                    <SpeedChart runner={runner} race={race} averageSpeed={averageSpeed} />
                </div>
            }
        </div>
    );
};

export default RunnerDetailsStats;
