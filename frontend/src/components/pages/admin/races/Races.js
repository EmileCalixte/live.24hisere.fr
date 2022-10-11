import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../../util/ApiUtil";
import {app} from "../../../App";
import CircularLoader from "../../../misc/CircularLoader";
import {Link} from "react-router-dom";

const Races = () => {
    // false = not fetched yet. Once fetched, it's an array
    const [races, setRaces] = useState(false);

    const fetchRaces = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/races', app.state.accessToken);
        const responseJson = await response.json();

        setRaces(responseJson.races);
    }, []);

    useEffect(() => {
        fetchRaces();
    }, [fetchRaces]);

    return (
        <div id="page-admin-runners">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Courses" />
                    </Breadcrumbs>
                </div>
            </div>

            {races === false &&
            <CircularLoader />
            }

            {races !== false &&
            <div className="row">
                <div className="col-12">
                    {races.length === 0 &&
                    <p>Aucune course</p>
                    }

                    {races.length > 0 &&
                    <ul className="admin-list">
                        {races.map(race => {
                            return (
                                <li key={race.id}>
                                    <Link to={`/admin/races/${race.id}`}>
                                        {race.name} ({race.runnerCount})
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default Races;
