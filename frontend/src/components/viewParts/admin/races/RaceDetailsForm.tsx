import React, { useMemo } from "react";
import { getDateStringFromDate, getTimeStringFromDate } from "../../../../util/utils";
import { Checkbox } from "../../../ui/forms/Checkbox";
import DurationInputs from "../../../ui/forms/DurationInputs";
import { Input } from "../../../ui/forms/Input";

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

export default function RaceDetailsForm({
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
}: RaceDetailsFormProps): React.ReactElement {
    const startTimeDate = useMemo<string>(() => { // This should trigger a build failure
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

    const onStartTimeDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.value) {
            return;
        }

        setStartTime(new Date(`${e.target.value}T${startTimeTime}`));
    };

    const onStartTimeTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (!e.target.value || !startTimeDate) {
            return;
        }

        setStartTime(new Date(`${startTimeDate}T${e.target.value}`));
    };

    return (
        <form onSubmit={onSubmit}>
            <Input label="Nom"
                   maxLength={50}
                   required
                   name="name"
                   value={name}
                   onChange={e => setName(e.target.value)}
            />

            <Input label="Distance avant premier passage (m)"
                   className="mt-3"
                   type="number"
                   min={0}
                   step={0.001}
                   required
                   name="initial-distance"
                   value={initialDistance}
                   onChange={e => setInitialDistance(e.target.value)}
            />

            <Input label="Distance du tour (m)"
                   className="mt-3"
                   type="number"
                   min={0}
                   step={0.001}
                   required
                   name="lap-distance"
                   value={lapDistance}
                   onChange={e => setLapDistance(e.target.value)}
            />

            <div className="input-group mt-3">
                <label>
                    Date et heure de départ
                    <input className="input"
                           type="date"
                           required={true}
                           value={startTimeDate}
                           name="start-date"
                           onChange={onStartTimeDateChange}
                    />
                    <input className="input"
                           type="time"
                           step={1}
                           required={true}
                           value={startTimeTime}
                           name="start-time"
                           onChange={onStartTimeTimeChange}
                    />
                </label>
            </div>

            <DurationInputs legend="Durée"
                            className="mt-3"
                            duration={duration}
                            setDuration={setDuration}
            />

            <Checkbox label="Visible par les utilisateurs"
                      checked={isPublic}
                      className="mt-3"
                      onChange={e => setIsPublic(e.target.checked)}
            />

            <button className="button mt-3"
                    type="submit"
                    disabled={submitButtonDisabled}
            >
                Enregistrer
            </button>
        </form>
    );
}
