import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import RaceDetailsForm from "./RaceDetailsForm";
import {useState} from "react";
import ApiUtil from "../../../../util/ApiUtil";
import {app} from "../../../App";
import ToastUtil from "../../../../util/ToastUtil";
import {Navigate} from "react-router-dom";
import Util from "../../../../util/Util";

const CreateRace = () => {
    const [raceName, setRaceName] = useState('');
    const [initialDistance, setInitialDistance] = useState(0);
    const [lapDistance, setLapDistance] = useState(0);
    const [startTime, setStartTime] = useState(new Date());
    const [isPublic, setIsPublic] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const [redirectToId, setRedirectToId] = useState(null);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const body = {
            name: raceName,
            isPublic,
            startTime: Util.formatDateForApi(startTime),
            initialDistance,
            lapDistance,
        };

        const response = await ApiUtil.performAuthenticatedAPIRequest("/admin/races", app.state.accessToken, {
            method: 'POST',
            body: JSON.stringify(body),
        });

        const responseJson = await response.json();

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            console.error(responseJson);
            setIsSaving(false);
            return;
        }

        ToastUtil.getToastr().success("Course créée");
        setRedirectToId(responseJson.id);
    }

    if (redirectToId) {
        return (
            <Navigate to={`/admin/races/${redirectToId}`} />
        )
    }

    return (
        <div id="page-admin-create-race">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb url="/admin/races" label="Courses" />
                        <Crumb label="Créer une course" />
                    </Breadcrumbs>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-9 col-12">
                    <h2>Créer une course</h2>

                    <RaceDetailsForm onSubmit={onSubmit}
                                     name={raceName}
                                     setName={setRaceName}
                                     initialDistance={initialDistance}
                                     setInitialDistance={setInitialDistance}
                                     lapDistance={lapDistance}
                                     setLapDistance={setLapDistance}
                                     startTime={startTime}
                                     setStartTime={setStartTime}
                                     isPublic={isPublic}
                                     setIsPublic={setIsPublic}
                                     submitButtonDisabled={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}

export default CreateRace;
