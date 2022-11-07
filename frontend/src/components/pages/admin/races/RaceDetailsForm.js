import {useMemo} from "react";
import Util from "../../../../util/Util";

const RaceDetailsForm = ({
    onSubmit,
    name,
    onNameInputChange,
    initialDistance,
    onInitialDistanceInputChange,
    lapDistance,
    onLapDistanceInputChange,
    startTime,
    setStartTime,
    isPublic,
    onIsPublicInputChange,
    submitButtonDisabled,
}) => {
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

    const onStartTimeDateChange = (e) => {
        setStartTime(new Date(`${e.target.value}T${startTimeTime}`));
    }

    const onStartTimeTimeChange = (e) => {
        setStartTime(new Date(`${startTimeDate}T${e.target.value}`));
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="input-group">
                <label>
                    Nom
                    <input className="input"
                           type="text"
                           value={name}
                           name="name"
                           onChange={onNameInputChange}
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
                           onChange={onInitialDistanceInputChange}
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
                           onChange={onLapDistanceInputChange}
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
                           onChange={onIsPublicInputChange}
                    />
                    <span/>
                    Visible par les utilisateurs
                </label>
            </div>

            <button className="button mt-3"
                    type="submit"
                    disabled={submitButtonDisabled}
            >
                Enregistrer
            </button>
        </form>
    );
}

export default RaceDetailsForm;
