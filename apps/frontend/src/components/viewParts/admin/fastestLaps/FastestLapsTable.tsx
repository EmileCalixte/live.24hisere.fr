import React from "react";
import { Link } from "react-router-dom";
import {
    type AdminPassageWithRunnerId,
    type PublicProcessedPassage,
    type RaceDict,
} from "@live24hisere/types";
import { type Runner } from "../../../../types/Runner";
import { formatFloatNumber, formatMsAsDuration } from "../../../../utils/utils";

interface FastestLapsTableProps {
    passages: Array<PublicProcessedPassage<AdminPassageWithRunnerId>>;
    races: RaceDict;
    runners: Runner[];
}

export default function FastestLapsTable({
    passages,
    races,
    runners,
}: FastestLapsTableProps): React.ReactElement {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Coureur</th>
                    <th>Course</th>
                    <th>Durée tour</th>
                    <th>Vitesse tour</th>
                    <th>Temps de course</th>
                </tr>
            </thead>
            <tbody>
                {passages.map((passage) => {
                    const runner = runners.find(
                        (ru) => ru.id === passage.runnerId,
                    );

                    if (!runner) {
                        return null;
                    }

                    const race = runner ? races[runner?.raceId] : undefined; // undefined should never happen

                    return (
                        <tr key={passage.id}>
                            <td style={{ fontSize: "0.85em" }}>{passage.id}</td>
                            <td>
                                <Link to={`/runner-details/${runner.id}`}>
                                    {`${runner.id} – ${runner.firstname} ${runner.lastname}`}
                                </Link>
                            </td>
                            <td>{race?.name ?? <i>Course inconnue</i>}</td>
                            <td>
                                {formatMsAsDuration(
                                    passage.processed.lapDuration,
                                    false,
                                )}
                            </td>
                            <td>
                                {`${formatFloatNumber(passage.processed.lapSpeed, 2)} km/h`}
                            </td>
                            <td>
                                {`${formatMsAsDuration(passage.processed.lapStartRaceTime)} – ${formatMsAsDuration(passage.processed.lapEndRaceTime)}`}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
