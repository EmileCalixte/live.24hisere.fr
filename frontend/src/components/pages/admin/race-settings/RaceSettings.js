import Breadcrumbs from "../../../layout/breadcrumbs/Breadcrumbs";
import Crumb from "../../../layout/breadcrumbs/Crumb";
import {useEffect, useMemo, useState} from "react";
import {app} from "../../../App";
import ApiUtil from "../../../../util/ApiUtil";
import CircularLoader from "../../../misc/CircularLoader";

const RaceSettings = () => {
    const [isWaitingForInitialFetch, setIsWaitingForInitialFetch] = useState(true);
    const [raceStartTime, setRaceStartTime] = useState(null);
    const [firstLapDistance, setFirstLapDistance] = useState(0);
    const [lapDistance, setLapDistance] = useState(0);

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

        console.log(raceStartTime);
        return '2001-02-03'; // TODO
    }, [raceStartTime]);

    const raceStartTimeTime = useMemo(() => {
        if (!raceStartTime) {
            return '';
        }

        console.log(raceStartTime);
        return '01:23:45'; // TODO
    }, [raceStartTime]);

    const onRaceStartTimeDateChange = (e) => {
        console.log('RACE START DATE CHANGE', e);
    }

    const onRaceStartTimeTimeChange = (e) => {
        console.log('RACE START TIME CHANGE', e);
    }

    const onSubmit = (e) => {
        console.log('SUBMIT');
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
                                />
                            </label>
                        </div>

                        <div className="input-group mt-3">
                            <label>
                                Distance du tour (mètres)
                                <input type="number"
                                       className="input"
                                       defaultValue={lapDistance}
                                />
                            </label>
                        </div>
                    </form>
                </div>
            </div>
            }
        </div>
    )
}

export default RaceSettings;
