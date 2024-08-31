import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { type ProcessedPassage, type Race } from "@live24hisere/types";
import { NO_VALUE_PLACEHOLDER } from "../../../constants/misc";
import { type Ranking, type RankingRunner } from "../../../types/Ranking";
import { type RunnerWithProcessedHours } from "../../../types/Runner";
import { getPaceFromSpeed } from "../../../utils/mathUtils";
import {
    getFastestLapPassage,
    getSlowestLapPassage,
} from "../../../utils/passageUtils";
import { formatMsAsDuration } from "../../../utils/utils";
import SpeedChart from "./charts/SpeedChart";
import RunnerDetailsStatsRankingTable from "./RunnerDetailsStatsRankingTable";

interface RunnerDetailsStatsProps {
    runner: RankingRunner & RunnerWithProcessedHours;
    race: Race;
    ranking: Ranking;
}

export default function RunnerDetailsStats({
    runner,
    race,
    ranking,
}: RunnerDetailsStatsProps): React.ReactElement {
    const raceInitialDistance = Number(race.initialDistance);
    const raceLapDistance = Number(race.lapDistance);

    const completeLapCount = useMemo<number>(() => {
        if (raceInitialDistance > 0) {
            return Math.max(0, runner.passages.length - 1);
        }

        return runner.passages.length;
    }, [raceInitialDistance, runner.passages.length]);

    /** Total distance in meters */
    const totalDistance = useMemo<number>(() => {
        if (runner.passages.length >= 1) {
            if (raceInitialDistance > 0) {
                return (
                    raceInitialDistance +
                    raceLapDistance * (runner.passages.length - 1)
                );
            }

            return raceLapDistance * runner.passages.length;
        }

        return 0;
    }, [raceInitialDistance, raceLapDistance, runner.passages.length]);

    const lastPassageDate = useMemo<Date | null>(() => {
        if (runner.passages.length <= 0) {
            return null;
        }

        return new Date(runner.passages[runner.passages.length - 1].time);
    }, [runner]);

    const fastestLapPassage = useMemo<ProcessedPassage | null>(
        () => getFastestLapPassage(runner.passages),
        [runner],
    );

    const slowestLapPassage = useMemo<ProcessedPassage | null>(
        () => getSlowestLapPassage(runner.passages),
        [runner],
    );

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
        return (totalDistance / lastPassageRaceTime) * 1000 * 3.6;
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

                    <RunnerDetailsStatsRankingTable
                        runner={runner}
                        ranking={ranking}
                    />

                    <p>Statistiques de course</p>

                    <ul>
                        <li>
                            Nombre de tours complets :{" "}
                            <strong>{completeLapCount}</strong>
                        </li>
                        <li>
                            Distance totale :{" "}
                            <strong>
                                {(totalDistance / 1000).toFixed(3)} km
                            </strong>
                        </li>

                        <li>
                            Tour le plus rapide :{" "}
                            {fastestLapPassage === null && NO_VALUE_PLACEHOLDER}
                            {fastestLapPassage !== null && (
                                <ul>
                                    <li>
                                        Tour{" "}
                                        {fastestLapPassage.processed.lapNumber}{" "}
                                        à{" "}
                                        <strong>
                                            {formatMsAsDuration(
                                                fastestLapPassage.processed
                                                    .lapEndRaceTime,
                                            )}
                                        </strong>{" "}
                                        de course
                                    </li>
                                    <li>
                                        Durée du tour :{" "}
                                        <strong>
                                            {formatMsAsDuration(
                                                fastestLapPassage.processed
                                                    .lapDuration,
                                            )}
                                        </strong>
                                    </li>
                                    <li>
                                        Vitesse :{" "}
                                        <strong>
                                            {fastestLapPassage.processed.lapSpeed.toFixed(
                                                2,
                                            )}{" "}
                                            km/h
                                        </strong>
                                    </li>
                                    <li>
                                        Allure :{" "}
                                        <strong>
                                            {formatMsAsDuration(
                                                fastestLapPassage.processed
                                                    .lapPace,
                                                false,
                                            )}
                                            /km
                                        </strong>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            Tour le plus lent :{" "}
                            {slowestLapPassage === null && NO_VALUE_PLACEHOLDER}
                            {slowestLapPassage !== null && (
                                <ul>
                                    <li>
                                        Tour{" "}
                                        {slowestLapPassage.processed.lapNumber}{" "}
                                        à{" "}
                                        <strong>
                                            {formatMsAsDuration(
                                                slowestLapPassage.processed
                                                    .lapEndRaceTime,
                                            )}
                                        </strong>{" "}
                                        de course
                                    </li>
                                    <li>
                                        Durée :{" "}
                                        <strong>
                                            {formatMsAsDuration(
                                                slowestLapPassage.processed
                                                    .lapDuration,
                                            )}
                                        </strong>
                                    </li>
                                    <li>
                                        Vitesse :{" "}
                                        <strong>
                                            {slowestLapPassage.processed.lapSpeed.toFixed(
                                                2,
                                            )}{" "}
                                            km/h
                                        </strong>
                                    </li>
                                    <li>
                                        Allure :{" "}
                                        <strong>
                                            {formatMsAsDuration(
                                                slowestLapPassage.processed
                                                    .lapPace,
                                                false,
                                            )}
                                            /km
                                        </strong>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            Vitesse moyenne de 00:00:00 à{" "}
                            {lastPassageRaceTime !== null
                                ? formatMsAsDuration(lastPassageRaceTime)
                                : "--:--:--"}
                            <> : </>
                            <strong>
                                {averageSpeed !== null
                                    ? averageSpeed.toFixed(2) + " km/h"
                                    : "n/a"}
                            </strong>
                            {averagePace !== null && (
                                <ul>
                                    <li>
                                        Allure :{" "}
                                        <strong>
                                            {formatMsAsDuration(
                                                averagePace,
                                                false,
                                            ) + "/km"}
                                        </strong>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </Col>
            </Row>

            {averageSpeed !== null && (
                <Row>
                    <Col>
                        <h2>Vitesse</h2>

                        <SpeedChart
                            runner={runner}
                            race={race}
                            averageSpeed={averageSpeed}
                        />
                    </Col>
                </Row>
            )}
        </>
    );
}
