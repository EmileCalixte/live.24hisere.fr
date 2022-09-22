import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useEffect, useMemo, useState} from "react";
import {app} from "../../../App";
import ApiUtil from "../../../../util/ApiUtil";
import CircularLoader from "../../../misc/CircularLoader";
import Util from "../../../../util/Util";
import ToastUtil from "../../../../util/ToastUtil";

const RaceSettings = () => {
    const [isWaitingForInitialFetch, setIsWaitingForInitialFetch] = useState(true);
    const [raceStartTime, setRaceStartTime] = useState(null);
    const [firstLapDistance, setFirstLapDistance] = useState(0);
    const [lapDistance, setLapDistance] = useState(0);

    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    useEffect(() => {
        (async () => {
            await fetchRaceSettings();
            setIsWaitingForInitialFetch(false);
        })();
    }, []);

    const fetchRaceSettings = async () => {
        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/race-settings', app.state.accessToken);

        const responseJson = await response.json();

        setRaceStartTime(new Date(responseJson.raceStartTime));
        setFirstLapDistance(responseJson.firstLapDistance);
        setLapDistance(responseJson.lapDistance);
    }

    const raceStartTimeDate = useMemo(() => {
        if (!raceStartTime) {
            return '';
        }

        // Date input value requires YYYY-MM-DD format
        return Util.getDateStringFromDate(raceStartTime, '-').split('-').reverse().join('-');
    }, [raceStartTime]);

    const raceStartTimeTime = useMemo(() => {
        if (!raceStartTime) {
            return '';
        }

        return Util.getTimeStringFromDate(raceStartTime);
    }, [raceStartTime]);

    const onRaceStartTimeDateChange = (e) => {
        setRaceStartTime(new Date(`${e.target.value}T${raceStartTimeTime}`));
    }

    const onRaceStartTimeTimeChange = (e) => {
        setRaceStartTime(new Date(`${raceStartTimeDate}T${e.target.value}`));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitButtonDisabled(true);

        const formData = new FormData();
        formData.append('raceStartTime', Util.formatDateForApi(raceStartTime));
        formData.append('firstLapDistance', firstLapDistance);
        formData.append('lapDistance', lapDistance);

        const body = {
            raceStartTime: Util.formatDateForApi(raceStartTime),
            firstLapDistance,
            lapDistance
        }

        const response = await ApiUtil.performAuthenticatedAPIRequest('/admin/race-settings', app.state.accessToken, {
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

        setSubmitButtonDisabled(false);
        ToastUtil.getToastr().success('Paramètres enregistrés');
    }

    return (
        <div id="page-admin-race-settings">
            <div className="row">
                <div className="col-12">
                    <Breadcrumbs>
                        <Crumb url="/admin" label="Administration" />
                        <Crumb label="Paramètres de course" />
                    </Breadcrumbs>
                </div>
            </div>

            {isWaitingForInitialFetch &&
            <CircularLoader />
            }

            {!isWaitingForInitialFetch &&
            <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
                    <form onSubmit={onSubmit}>
                        <div className="input-group">
                            <label>
                                Début de la course
                                <input className="input"
                                       type="date"
                                       defaultValue={raceStartTimeDate}
                                       name="race-settings-race-start-date"
                                       onChange={onRaceStartTimeDateChange}
                                />
                                <input className="input"
                                       type="time"
                                       step={1}
                                       defaultValue={raceStartTimeTime}
                                       name="race-settings-race-start-time"
                                       onChange={onRaceStartTimeTimeChange}
                                />
                            </label>
                        </div>

                        <div className="input-group mt-3">
                            <label>
                                Distance avant premier passage (mètres)
                                <input type="number"
                                       className="input"
                                       defaultValue={firstLapDistance}
                                       onChange={(e) => setFirstLapDistance(parseFloat(e.target.value))}
                                />
                            </label>
                        </div>

                        <div className="input-group mt-3">
                            <label>
                                Distance du tour (mètres)
                                <input type="number"
                                       className="input"
                                       defaultValue={lapDistance}
                                       onChange={(e) => setLapDistance(parseFloat(e.target.value))}
                                />
                            </label>
                        </div>

                        <button className="button mt-3"
                                type="submit"
                                disabled={submitButtonDisabled}
                        >
                            Enregistrer
                        </button>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default RaceSettings;
