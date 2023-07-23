import {Link} from "react-router-dom";
import {getCategoryCodeFromBirthYear} from "../../../../util/ffaUtils";
import CircularLoader from "../../../ui/CircularLoader";

interface RunnersTableProps {
    runners: Runner[];
    races: AdminRaceDict | false;
}

export default function RunnersTable({runners, races}: RunnersTableProps) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Doss.</th>
                    <th>Nom</th>
                    <th>Sexe</th>
                    <th>Année naissance</th>
                    <th>Catégorie</th>
                    <th>Course</th>
                    <th>Détails</th>
                </tr>
            </thead>
            <tbody>
                {runners.map(runner => {
                    return (
                        <tr key={runner.id}>
                            <td>{runner.id}</td>
                            <td>
                                {runner.lastname.toUpperCase()} {runner.firstname}
                            </td>
                            <td>{runner.gender}</td>
                            <td>{runner.birthYear}</td>
                            <td>{getCategoryCodeFromBirthYear(runner.birthYear)}</td>
                            <td>
                                {(() => {
                                    if (races === false) {
                                        return <CircularLoader />;
                                    }

                                    if (runner.raceId in races) {
                                        return races[runner.raceId].name;
                                    }

                                    return (
                                        <i>Course inconnue</i>
                                    );
                                })()}
                            </td>
                            <td>
                                <Link to={`/admin/runners/${runner.id}`}>
                                    Détails
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
