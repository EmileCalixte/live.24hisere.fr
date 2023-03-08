import React, {type FunctionComponent, useMemo} from "react";
import {getDateStringFromDate, getTimeStringFromDate} from "../../../../util/utils";
import DurationInputs from "../../../misc/DurationInputs";

interface RaceDetailsFormProps {
    onSubmit: (e: React.FormEvent) => any;
    name: string;
    setName: (name: string) => any;
    initialDistance: number | string;
    setInitialDistance: (initialDistance: number | string) => any;
    lapDistance: number | string;
    setLapDistance: (lapDistance: number | string) => any;
    startTime: Date;
    setStartTime: (startTime: Date) => any;
    duration: number;
    setDuration: (duration: number) => any;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => any;
    submitButtonDisabled: boolean;
}

const RaceDetailsForm: FunctionComponent<RaceDetailsFormProps> = ({
    onSubmit,
    name,
    setName,
    initialDistance,
    setInitialDistance,
    lapDistance,
    setLapDistance,
    startTime,
    setStartTime,
    duration,
    setDuration,
    isPublic,
    setIsPublic,
    submitButtonDisabled,
}) => {
    const startTimeDate = useMemo(() => {
        if (!startTime) {
            return;
        }

        // Date input value requires YYYY-MM-DD format
        return getDateStringFromDate(startTime, "-").split("-").reverse().join("-");
    }, [startTime]);

    const startTimeTime = useMemo(() => {
        if (!startTime) {
            return "";
        }

        return getTimeStringFromDate(startTime);
    }, [startTime]);

    const onStartTimeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            return;
        }

        setStartTime(new Date(`${e.target.value}T${startTimeTime}`));
    };

    const onStartTimeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            return;
        }

        setStartTime(new Date(`${startTimeDate}T${e.target.value}`));
    };

    return (
        <form onSubmit={onSubmit}>
            <div className="input-group">
                <label>
                    Nom
                    <input className="input"
                           type="text"
                           maxLength={50}
                           required={true}
                           value={name}
                           name="name"
                           onChange={e => setName(e.target.value)}
                    />
                </label>
            </div>

            <div className="input-group mt-3">
                <label>
                    Distance avant premier passage (m)
                    <input className="input"
                           type="number"
                           step={0.001}
                           min={0}
                           required={true}
                           value={initialDistance}
                           name="initial-distance"
                           onChange={e => setInitialDistance(e.target.value)}
                    />
                </label>
            </div>

            <div className="input-group mt-3">
                <label>
                    Distance du tour (m)
                    <input className="input"
                           type="number"
                           step={0.001}
                           min={0}
                           required={true}
                           value={lapDistance}
                           name="initial-distance"
                           onChange={e => setLapDistance(e.target.value)}
                    />
                </label>
            </div>

            <div className="input-group mt-3">
                <label>
                    Date et heure de départ
                    <input className="input"
                           type="date"
                           required={true}
                           defaultValue={startTimeDate}
                           name="start-date"
                           onChange={onStartTimeDateChange}
                    />
                    <input className="input"
                           type="time"
                           step={1}
                           required={true}
                           defaultValue={startTimeTime}
                           name="start-time"
                           onChange={onStartTimeTimeChange}
                    />
                </label>
            </div>

            <div className="mt-3">
                <legend>
                    Durée
                </legend>
                <div className="inline-input-group">
                    <DurationInputs duration={duration} setDuration={setDuration}/>
                </div>
            </div>

            <div className="inline-input-group mt-3">
                <label className="input-checkbox">
                    <input type="checkbox"
                           checked={isPublic}
                           onChange={e => setIsPublic(e.target.checked)}
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
};

export default RaceDetailsForm;
