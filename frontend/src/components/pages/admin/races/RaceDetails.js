import {useParams} from "react-router-dom";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";

const RaceDetails = () => {
    const {raceId: urlRaceId} = useParams();

    console.log(urlRaceId);

    return (
        <div id="page-admin-race-details">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/races" label="Courses" />
                        <Crumb label={urlRaceId} /> {/*TODO once race fetched, use name instead of ID*/}
                    </Breadcrumbs>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    {urlRaceId}
                </div>
            </div>
        </div>
    )
}

export default RaceDetails;
