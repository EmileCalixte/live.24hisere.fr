import {Navigate, useParams} from "react-router-dom";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useCallback, useEffect, useState} from "react";
import CircularLoader from "../../../misc/CircularLoader";
import ApiUtil from "../../../../util/ApiUtil";
import {app} from "../../../App";

const RaceDetails = () => {
    const {raceId: urlRaceId} = useParams();

    const [race, setRace] = useState(undefined);

    const fetchRace = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/races/${urlRaceId}`, app.state.accessToken);

        if (!response.ok) {
            console.error('Failed to fetch race', await response.json());
            setRace(null);
            return;
        }

        const responseJson = await response.json();

        setRace(responseJson.race);
    }, [urlRaceId]);

    useEffect(() => {
        fetchRace();
    }, [fetchRace]);

    console.log(race);

    if (race === null) {
        return (
            <Navigate to="/admin/races" />
        );
    }

    return (
        <div id="page-admin-race-details">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/races" label="Courses" />
                        {(() => {
                            if (race === undefined) {
                                return (
                                    <CircularLoader />
                                )
                            }

                            return (
                                <Crumb label={race.name}/>
                            )
                        })()}
                    </Breadcrumbs>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {race === undefined &&
                    <CircularLoader />
                    }

                    {race !== undefined &&
                    race.name
                    }
                </div>
            </div>
        </div>
    )
}

export default RaceDetails;
