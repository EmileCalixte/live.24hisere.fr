import {Navigate, useParams} from "react-router-dom";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useCallback, useEffect, useMemo, useState} from "react";
import CircularLoader from "../../../misc/CircularLoader";
import ApiUtil from "../../../../util/ApiUtil";
import {app} from "../../../App";
import Util from "../../../../util/Util";
import ToastUtil from "../../../../util/ToastUtil";
import RaceDetailsForm from "./RaceDetailsForm";

const RaceDetails = () => {
    const {raceId: urlRaceId} = useParams();

    const [race, setRace] = useState(undefined);

    const [raceName, setRaceName] = useState(null);
    const [initialDistance, setInitialDistance] = useState(null);
    const [lapDistance, setLapDistance] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(0);
    const [isPublic, setIsPublic] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);

    const unsavedChanges = useMemo(() => {
        if (!race) {
            return false;
        }

        return[
            raceName === race.name,
            initialDistance.toString() === race.initialDistance.toString(),
            lapDistance.toString() === race.lapDistance.toString(),
            startTime.getTime() === new Date(race.startTime).getTime(),
            duration === race.duration * 1000,
            isPublic === race.isPublic,
        ].includes(false);
    }, [race, raceName, initialDistance, lapDistance, startTime, duration, isPublic]);

    const fetchRace = useCallback(async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/races/${urlRaceId}`, app.state.accessToken);

        if (!response.ok) {
            console.error('Failed to fetch race', await response.json());
            setRace(null);
            return;
        }

        const responseJson = await response.json();

        setRace(responseJson.race);

        setRaceName(responseJson.race.name);
        setInitialDistance(responseJson.race.initialDistance);
        setLapDistance(responseJson.race.lapDistance);
        setStartTime(new Date(responseJson.race.startTime));
        setDuration(responseJson.race.duration * 1000);
        setIsPublic(responseJson.race.isPublic);
    }, [urlRaceId]);

    useEffect(() => {
        fetchRace();
    }, [fetchRace]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const body = {
            name: raceName,
            isPublic,
            startTime: Util.formatDateForApi(startTime),
            duration: Math.floor(duration / 1000),
            initialDistance,
            lapDistance,
        };

        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/races/${race.id}`, app.state.accessToken, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });

        const responseJson = await response.json();

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            console.error(responseJson);
            setIsSaving(false);
            return;
        }

        ToastUtil.getToastr().success("Paramètres de la course enregistrés");

        await fetchRace();
        setIsSaving(false);
    }

    const deleteRace = async () => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette course ?")) {
            return;
        }

        if (race.runnerCount > 0) {
            return;
        }

        const response = await ApiUtil.performAuthenticatedAPIRequest(`/admin/races/${race.id}`, app.state.accessToken, {
            method: 'DELETE',
        });

        if (!response.ok) {
            ToastUtil.getToastr().error("Une erreur est survenue");
            const responseJson = await response.json();
            console.error(responseJson);
            return;
        }

        ToastUtil.getToastr().success("Course supprimée");
        setRedirectAfterDelete(true);
    }

    if (redirectAfterDelete) {
        return (
            <Navigate to="/admin/races" />
        )
    }

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
                <div className="col-xl-4 col-lg-6 col-md-9 col-12">
                    {race === undefined &&
                    <CircularLoader />
                    }

                    {race !== undefined &&
                    <div className="row">
                        <div className="col-12">
                            <RaceDetailsForm onSubmit={onSubmit}
                                             name={raceName}
                                             setName={setRaceName}
                                             initialDistance={initialDistance}
                                             setInitialDistance={setInitialDistance}
                                             lapDistance={lapDistance}
                                             setLapDistance={setLapDistance}
                                             startTime={startTime}
                                             setStartTime={setStartTime}
                                             duration={duration}
                                             setDuration={setDuration}
                                             isPublic={isPublic}
                                             setIsPublic={setIsPublic}
                                             submitButtonDisabled={isSaving || !unsavedChanges}
                            />
                        </div>

                        <div className="col-12">
                            <h3>Supprimer la course</h3>

                            {race.runnerCount > 0 &&
                            <p>La course ne peut pas être supprimée tant qu'elle contient des coureurs.</p>
                            }

                            {race.runnerCount === 0 &&
                            <p>Cette action est irréversible.</p>
                            }

                            <button className="button red mt-3"
                                    disabled={race.runnerCount > 0}
                                    onClick={deleteRace}
                            >
                                Supprimer la course
                            </button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default RaceDetails;
