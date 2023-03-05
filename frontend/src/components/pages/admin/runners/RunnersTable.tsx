import {Link} from "react-router-dom";
import CircularLoader from "../../../misc/CircularLoader";
import React from "react";
import Runner from "../../../../types/Runner";
import {AdminRaceDict} from "../../../../types/Race";

const RunnersTable: React.FunctionComponent<{
    runners: Runner[],
    races: AdminRaceDict | false,
}> = ({runners, races}) => {
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
                        <td>{runner.category.toUpperCase()}</td>
                        <td>
                            {(() => {
                                if (races === false) {
                                    return <CircularLoader />
                                }

                                if (races.hasOwnProperty(runner.raceId)) {
                                    return races[runner.raceId].name
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

export default RunnersTable;
