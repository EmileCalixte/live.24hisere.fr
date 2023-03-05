import React from "react";
import {Link} from "react-router-dom";
import {AdminPassageWithRunnerId, ProcessedPassage} from "../../../../types/Passage";
import {AdminRaceDict} from "../../../../types/Race";
import Runner from "../../../../types/Runner";
import Util from "../../../../util/Util";

const FastestLapsTable: React.FunctionComponent<{
    passages: (AdminPassageWithRunnerId & ProcessedPassage)[]
    races: AdminRaceDict,
    runners: Runner[]
}> = ({
    passages,
    races,
    runners,
}) => {
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
            {passages.map(passage => {
                const runner = runners.find(ru => ru.id === passage.runnerId);
                const race = runner ? races[runner?.raceId] : undefined; // undefined should never happen

                return (
                    <tr key={passage.id}>
                        <td style={{fontSize: "0.85em"}}>{passage.id}</td>
                        <td>
                            <Link to={`/runner-details/${runner?.id}`}>
                                {`${runner?.id} – ${runner?.firstname} ${runner?.lastname}`}
                            </Link>
                        </td>
                        <td>
                            {`${race?.name}`}
                        </td>
                        <td>
                            {Util.formatMsAsDuration(passage.processed.lapDuration, false)}
                        </td>
                        <td>
                            {`${Util.formatFloatNumber(passage.processed.lapSpeed, 2)} km/h`}
                        </td>
                        <td>
                            {`${Util.formatMsAsDuration(passage.processed.lapStartRaceTime)} – ${Util.formatMsAsDuration(passage.processed.lapEndRaceTime)}`}
                        </td>
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
}

export default FastestLapsTable;
