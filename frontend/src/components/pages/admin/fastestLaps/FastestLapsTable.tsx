import {type FunctionComponent} from "react";
import {Link} from "react-router-dom";
import {type AdminPassageWithRunnerId, type ProcessedPassage} from "../../../../types/Passage";
import {type AdminRaceDict} from "../../../../types/Race";
import type Runner from "../../../../types/Runner";
import Util from "../../../../util/Util";

interface FastestLapsTableProps {
    passages: (AdminPassageWithRunnerId & ProcessedPassage)[];
    races: AdminRaceDict;
    runners: Runner[];
}

const FastestLapsTable: FunctionComponent<FastestLapsTableProps> = ({
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
                    );
                })}
            </tbody>
        </table>
    );
};

export default FastestLapsTable;
