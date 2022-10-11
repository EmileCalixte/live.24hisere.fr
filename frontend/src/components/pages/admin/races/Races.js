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
        <div id="page-admin-races">
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
                                        <div className="admin-list-link-label">
                                            {race.name}
                                        </div>
                                        <div className="admin-list-link-secondary-icons">
                                            <div className="admin-list-link-secondary-icon-group">
                                                <i className="fa-solid fa-person-running"/>
                                                {race.runnerCount}
                                            </div>
                                            <div className="admin-list-link-secondary-icon-group">
                                                {race.isPublic &&
                                                <i className="fa-solid fa-eye"/>
                                                }

                                                {!race.isPublic &&
                                                <i className="fa-solid fa-eye-slash" style={{color: "#999"}}/>
                                                }
                                            </div>
                                        </div>
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
