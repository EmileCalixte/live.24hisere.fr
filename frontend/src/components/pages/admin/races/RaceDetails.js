import {Navigate, useParams} from "react-router-dom";
import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useCallback, useEffect, useMemo, useState} from "react";
import CircularLoader from "../../../misc/CircularLoader";
import ApiUtil from "../../../../util/ApiUtil";
import {app} from "../../../App";
import Util from "../../../../util/Util";
import ToastUtil from "../../../../util/ToastUtil";

const RaceDetails = () => {
    const {raceId: urlRaceId} = useParams();

    const [race, setRace] = useState(undefined);

    const [raceName, setRaceName] = useState(null);
    const [initialDistance, setInitialDistance] = useState(null);
    const [lapDistance, setLapDistance] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [isPublic, setIsPublic] = useState(null);

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const startTimeDate = useMemo(() => {
        if (!startTime) {
            return;
        }

        // Date input value requires YYYY-MM-DD format
        return Util.getDateStringFromDate(startTime, '-').split('-').reverse().join('-');
    }, [startTime]);

    const startTimeTime = useMemo(() => {
        if (!startTime) {
            return '';
        }

        return Util.getTimeStringFromDate(startTime);
    }, [startTime]);

    const unsavedChanges = useMemo(() => {
        if (!race) {
            return false;
        }

        return[
            raceName === race.name,
            initialDistance.toString() === race.initialDistance.toString(),
            lapDistance.toString() === race.lapDistance.toString(),
            startTime.getTime() === new Date(race.startTime).getTime(),
            isPublic === race.isPublic,
        ].includes(false);
    }, [race, raceName, initialDistance, lapDistance, startTime, isPublic]);

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
        setIsPublic(responseJson.race.isPublic);
    }, [urlRaceId]);

    useEffect(() => {
        fetchRace();
    }, [fetchRace]);

    const onStartTimeDateChange = (e) => {
        setStartTime(new Date(`${e.target.value}T${startTimeTime}`));
    }

    const onStartTimeTimeChange = (e) => {
        setStartTime(new Date(`${startTimeDate}T${e.target.value}`));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitButtonDisabled(true);

        const body = {
            name: raceName,
            isPublic,
            startTime: Util.formatDateForApi(startTime),
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
            setSubmitButtonDisabled(false);
            return;
        }

        ToastUtil.getToastr().success('Paramètres de la course enregistrés');

        await fetchRace();
        setSubmitButtonDisabled(false);
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
                    <form onSubmit={onSubmit}>
                        <div className="input-group">
                            <label>
                                Nom
                                <input className="input"
                                       type="text"
                                       value={raceName}
                                       name="name"
                                       onChange={(e) => setRaceName(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="input-group">
                            <label>
                                Distance avant premier passage (m)
                                <input className="input"
                                       type="number"
                                       step={0.001}
                                       value={initialDistance}
                                       name="initial-distance"
                                       onChange={(e) => setInitialDistance(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="input-group">
                            <label>
                                Distance du tour (m)
                                <input className="input"
                                       type="number"
                                       step={0.001}
                                       value={lapDistance}
                                       name="initial-distance"
                                       onChange={(e) => setLapDistance(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="input-group">
                            <label>
                                Départ
                                <input className="input"
                                       type="date"
                                       defaultValue={startTimeDate}
                                       name="start-date"
                                       onChange={onStartTimeDateChange}
                                />
                                <input className="input"
                                       type="time"
                                       step={1}
                                       defaultValue={startTimeTime}
                                       name="start-time"
                                       onChange={onStartTimeTimeChange}
                                />
                            </label>
                        </div>

                        <div className="inline-input-group mt-3">
                            <label className="input-checkbox">
                                <input type="checkbox"
                                       checked={isPublic}
                                       onChange={(e) => setIsPublic(e.target.checked)}
                                />
                                <span/>
                                Visible par les utilisateurs
                            </label>
                        </div>

                        <button className="button mt-3"
                                type="submit"
                                disabled={submitButtonDisabled || !unsavedChanges}
                        >
                            Enregistrer
                        </button>
                    </form>
                    }
                </div>
            </div>
        </div>
    )
}

export default RaceDetails;
