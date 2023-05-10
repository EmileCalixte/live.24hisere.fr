import {Col, Row} from "react-bootstrap";
import React, {useMemo} from "react";
import CircularLoader from "../../ui/CircularLoader";
import SpeedChart from "./charts/SpeedChart";
import {formatMsAsDuration} from "../../../util/utils";
import {getPaceFromSpeed} from "../../../util/RunnerDetailsUtil";

interface RunnerDetailsStatsProps {
    runner: RunnerWithProcessedPassages & RunnerWithProcessedHours;
    race: Race;
    ranks: RankingRunnerRanks | null;
}

export default function RunnerDetailsStats({runner, race, ranks}: RunnerDetailsStatsProps) {
    const completeLapCount = useMemo<number>(() => {
        if (race.initialDistance > 0) {
            return Math.max(0, runner.passages.length - 1);
        }

        return runner.passages.length;
    }, [race, runner]);

    /** Total distance in meters */
    const totalDistance = useMemo<number>(() => {
        if (runner.passages.length >= 1) {
            if (race.initialDistance > 0) {
                return race.initialDistance + race.lapDistance * (runner.passages.length - 1);
            }

            return race.lapDistance * runner.passages.length;
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

        return getPaceFromSpeed(averageSpeed);
    }, [averageSpeed]);

    return (
        <>
            <Row>
                <Col>
                    <h2>Données générales</h2>

                    <p>
                        Classement : {!ranks && <CircularLoader />}

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
                                    Tour {fastestLapPassage.processed.lapNumber} à <strong>{formatMsAsDuration(fastestLapPassage.processed.lapEndRaceTime)}</strong> de course,
                                    durée : <strong>{formatMsAsDuration(fastestLapPassage.processed.lapDuration)}</strong>,
                                    vitesse : <strong>{fastestLapPassage.processed.lapSpeed.toFixed(2)} km/h</strong>,
                                    allure : <strong>{formatMsAsDuration(fastestLapPassage.processed.lapPace, false)}/km</strong>
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
                                    Tour {slowestLapPassage.processed.lapNumber} à <strong>{formatMsAsDuration(slowestLapPassage.processed.lapEndRaceTime)}</strong> de course,
                                    durée : <strong>{formatMsAsDuration(slowestLapPassage.processed.lapDuration)}</strong>,
                                    vitesse : <strong>{slowestLapPassage.processed.lapSpeed.toFixed(2)} km/h</strong>,
                                    allure : <strong>{formatMsAsDuration(slowestLapPassage.processed.lapPace, false)}/km</strong>
                                </>
                            );
                        })()}
                    </p>

                    <p>
                        Vitesse moyenne de 00:00:00 à {lastPassageRaceTime !== null ? formatMsAsDuration(lastPassageRaceTime) : "--:--:--"} : <strong>{averageSpeed !== null ? averageSpeed.toFixed(2) + " km/h" : "n/a"}</strong> (allure moyenne : <strong>{averagePace !== null ? formatMsAsDuration(averagePace, false) + "/km" : "n/a"})</strong>
                    </p>
                </Col>
            </Row>

            {averageSpeed !== null &&
                <Row>
                    <Col>
                        <h2>Vitesse</h2>

                        <SpeedChart runner={runner} race={race} averageSpeed={averageSpeed} />
                    </Col>
                </Row>
            }
        </>

    );
}
