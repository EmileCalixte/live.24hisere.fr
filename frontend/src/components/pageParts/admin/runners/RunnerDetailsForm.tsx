import {useMemo} from "react";
import {Link} from "react-router-dom";
import {GENDER_OPTIONS} from "../../../../constants/Forms";
import {type SelectOption} from "../../../../types/Forms";
import {type Gender} from "../../../../types/Runner";
import {type AdminRaceWithRunnerCount} from "../../../../types/Race";
import {Input} from "../../../forms/Input";
import {getCategoryNameFromBirthYear} from "../../../../util/ffaUtils";
import RadioGroup from "../../../forms/RadioGroup";
import Select from "../../../forms/Select";

interface RunnerDetailsFormProps {
    onSubmit: (e: React.FormEvent) => any;
    id: number;
    setId: (id: number) => any;
    firstname: string;
    setFirstname: (firstname: string) => any;
    lastname: string;
    setLastname: (lastname: string) => any;
    gender: Gender;
    setGender: (gender: Gender) => any;
    birthYear: string;
    setBirthYear: (birthYear: string) => any;
    races: AdminRaceWithRunnerCount[] | false;
    raceId: number;
    setRaceId: (raceId: number) => any;
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
    races,
    raceId,
    setRaceId,
    submitButtonDisabled,
}: RunnerDetailsFormProps) {
    const racesOptions = useMemo<SelectOption[]>(() => {
        if (!races) {
            return [];
        }

        return races.map(race => ({
            label: `${race.name} (${race.runnerCount} ${race.runnerCount >= 2 ? "coureurs" : "coureur"})`,
            value: race.id,
        }));
    }, [races]);

    return (
        <form onSubmit={onSubmit}>
            <Input label="Dossard"
                   type="number"
                   name="id"
                   value={id}
                   onChange={e => setId(parseInt(e.target.value))}
                   required
                   min={1}
                   max={999999}
            />

            <Input className="mt-3"
                   label="Prénom"
                   name="firstname"
                   maxLength={255}
                   required
                   value={firstname}
                   onChange={e => setFirstname(e.target.value)}
            />

            <Input className="mt-3"
                   label="Nom de famille"
                   name="lastname"
                   maxLength={255}
                   required
                   value={lastname}
                   onChange={e => setLastname(e.target.value)}
            />

            <Input className="mt-3"
                   label="Année de naissance"
                   type="number"
                   name="birthYear"
                   min={1900}
                   max={new Date().getFullYear()}
                   required
                   value={birthYear}
                   onChange={e => setBirthYear(e.target.value)}
            />

            <div className="mt-1">
                <span>Catégorie : {getCategoryNameFromBirthYear(parseInt(birthYear))}</span>
            </div>

            <RadioGroup className="mt-3"
                        legend="Sexe"
                        options={GENDER_OPTIONS}
                        value={gender}
                        onSelectOption={option => setGender(option.value)}
            />

            {races && races.length < 1 ? (
                <p>Vous devez <Link to="/admin/races/create">créer une course</Link> pour pouvoir enregistrer un coureur.</p>
            ) : (
                <Select className="mt-3"
                        label="Course"
                        options={racesOptions}
                        displayLoadingOption={races === false}
                        loadingOptionLabel="Chargement des courses"
                        onChange={e => setRaceId(parseInt(e.target.value))}
                        value={raceId}
                />
            )}

            <button className="button mt-3"
                    type="submit"
                    disabled={submitButtonDisabled}
            >
                Enregistrer
            </button>
        </form>
    );
}
