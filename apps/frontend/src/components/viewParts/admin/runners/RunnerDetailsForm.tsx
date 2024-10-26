import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
    type AdminRaceWithRunnerCount,
    type Gender,
} from "@live24hisere/core/types";
import { GENDER_OPTIONS } from "../../../../constants/forms";
import { getCategoryNameFromBirthYear } from "../../../../utils/ffaUtils";
import { getRacesSelectOptions } from "../../../../utils/raceUtils";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";
import RadioGroup from "../../../ui/forms/RadioGroup";
import Select from "../../../ui/forms/Select";

interface RunnerDetailsFormProps {
    onSubmit: (e: React.FormEvent) => void;
    id: number;
    setId: (id: number) => void;
    firstname: string;
    setFirstname: (firstname: string) => void;
    lastname: string;
    setLastname: (lastname: string) => void;
    gender: Gender;
    setGender: (gender: Gender) => void;
    birthYear: string;
    setBirthYear: (birthYear: string) => void;
    stopped: boolean;
    setStopped: (stopped: boolean) => void;
    races: AdminRaceWithRunnerCount[] | false;
    raceId: number;
    setRaceId: (raceId: number) => void;
    submitButtonDisabled: boolean;
}

export default function RunnerDetailsForm({
    onSubmit,
    id,
    setId,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    gender,
    setGender,
    birthYear,
    setBirthYear,
    stopped,
    setStopped,
    races,
    raceId,
    setRaceId,
    submitButtonDisabled,
}: RunnerDetailsFormProps): React.ReactElement {
    const racesOptions = useMemo(() => {
        return getRacesSelectOptions(
            races,
            (race) =>
                `${race.name} (${race.runnerCount} ${race.runnerCount >= 2 ? "coureurs" : "coureur"})`,
        );
    }, [races]);

    return (
        <form onSubmit={onSubmit}>
            <Input
                label="Dossard"
                type="number"
                name="id"
                value={id}
                onChange={(e) => {
                    setId(parseInt(e.target.value));
                }}
                required
                min={1}
                max={999999}
            />

            <Input
                className="mt-3"
                label="Prénom"
                name="firstname"
                maxLength={255}
                required
                value={firstname}
                onChange={(e) => {
                    setFirstname(e.target.value);
                }}
            />

            <Input
                className="mt-3"
                label="Nom de famille"
                name="lastname"
                maxLength={255}
                required
                value={lastname}
                onChange={(e) => {
                    setLastname(e.target.value);
                }}
            />

            <Input
                className="mt-3"
                label="Année de naissance"
                type="number"
                name="birthYear"
                min={1900}
                max={new Date().getFullYear()}
                required
                value={birthYear}
                onChange={(e) => {
                    setBirthYear(e.target.value);
                }}
            />

            <div className="mt-1">
                <span>
                    Catégorie :{" "}
                    {getCategoryNameFromBirthYear(parseInt(birthYear))}
                </span>
            </div>

            <RadioGroup
                className="mt-3"
                legend="Sexe"
                options={GENDER_OPTIONS}
                value={gender}
                onSelectOption={(option) => {
                    setGender(option.value);
                }}
            />

            <Checkbox
                className="mt-3"
                label="Arrêté"
                checked={stopped}
                onChange={(e) => {
                    setStopped(e.target.checked);
                }}
            />

            {races && races.length < 1 ? (
                <p>
                    Vous devez{" "}
                    <Link to="/admin/races/create">créer une course</Link> pour
                    pouvoir enregistrer un coureur.
                </p>
            ) : (
                <Select
                    className="mt-3"
                    label="Course"
                    options={racesOptions}
                    isLoading={races === false}
                    loadingOptionLabel="Chargement des courses"
                    onChange={(e) => {
                        setRaceId(parseInt(e.target.value));
                    }}
                    value={raceId}
                />
            )}

            <button
                className="button mt-3"
                type="submit"
                disabled={submitButtonDisabled}
            >
                Enregistrer
            </button>
        </form>
    );
}
