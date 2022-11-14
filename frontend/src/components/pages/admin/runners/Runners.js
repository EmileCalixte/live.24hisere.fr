import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useCallback, useEffect, useState} from "react";
import ApiUtil from "../../../../util/ApiUtil";
import {app} from "../../../App";
import CircularLoader from "../../../misc/CircularLoader";
import {Link} from "react-router-dom";
import RunnersTable from "./RunnersTable";

const Runners = () => {
    // false = not fetched yet. Once fetched, it's an array
    const [runners, setRunners] = useState(false);

    // false = not fetched yet. Once fetched, it's an object
    const [races, setRaces] = useState(false);

    const fetchRunnersAndRaces = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/runners', app.state.accessToken);
        const responseJson = await response.json();

        setRunners(responseJson.runners);
        setRaces(responseJson.races);
    }, []);

    useEffect(() => {
        fetchRunnersAndRaces();
    }, [fetchRunnersAndRaces]);

    return (
        <div id="page-admin-runners">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Coureurs" />
                    </Breadcrumbs>
                </div>
            </div>

            {runners === false &&
            <CircularLoader />
            }

            {runners !== false &&
            <div className="row">
                <div className="col-12">
                    <Link to="/admin/runners/create" className="button">
                        <i className="fa-solid fa-plus mr-2"/>
                        Ajouter un coureur
                    </Link>
                </div>

                <div className="col-12 mt-3">
                    {runners.length === 0 &&
                    <p>Aucun coureur</p>
                    }

                    {runners.length > 0 &&
                    <RunnersTable runners={runners} races={races}/>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default Runners;
