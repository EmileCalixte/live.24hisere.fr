import React from "react";
import { type AdminPassageWithRunnerId } from "../../../../types/Passage";
import { type Race } from "../../../../types/Race";
import { type Runner } from "../../../../types/Runner";

interface LapsStatisticsTableProps {
    races: Race[];
    runners: Runner[];
    passages: AdminPassageWithRunnerId[];
}

export default function LapsStatisticsTable({
    races,
    runners,
    passages,
}: LapsStatisticsTableProps): React.ReactElement {
    return (
        <table className="table no-full-width">
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Total</th>
                    <th>Moyenne par coureurs</th>
                </tr>
            </thead>
            <tbody>
                {races.map(race => (
                    <tr key={race.id}>
                        <td>{race.name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
