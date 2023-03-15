import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useCallback, useContext, useEffect, useState} from "react";
import {performAuthenticatedAPIRequest} from "../../../../util/apiUtils";
import {userContext} from "../../../App";
import CircularLoader from "../../../misc/CircularLoader";
import {Link} from "react-router-dom";
import RunnersTable from "./RunnersTable";
import type Runner from "../../../../types/Runner";
import {type AdminRaceDict} from "../../../../types/Race";

export default function Runners() {
    const {accessToken} = useContext(userContext);

    // false = not fetched yet
    const [runners, setRunners] = useState<Runner[] | false>(false);

    // false = not fetched yet
    const [races, setRaces] = useState<AdminRaceDict | false>(false);

    const fetchRunnersAndRaces = useCallback(async () => {
        const response = await performAuthenticatedAPIRequest("/admin/runners", accessToken);
        const responseJson = await response.json();

        setRunners(responseJson.runners);
        setRaces(responseJson.races);
    }, [accessToken]);

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
    );
}
