import React from "react";
import {Gender} from "../../../../types/Runner";
import {RaceWithRunnerCount} from "../../../../types/Race";
import OptionWithLoadingDots from "../../../misc/OptionWithLoadingDots";
import {getCategoryNameFromBirthYear} from "../../../../util/FfaUtil";

const RunnerDetailsForm: React.FunctionComponent<{
    onSubmit: (e: React.FormEvent) => any,
    id: number,
    setId: (id: number) => any,
    firstname: string,
    setFirstname: (firstname: string) => any,
    lastname: string,
    setLastname: (lastname: string) => any,
    gender: Gender,
    setGender: (gender: Gender) => any,
    birthYear: string,
    setBirthYear: (birthYear: string) => any,
    races: RaceWithRunnerCount[] | false,
    raceId: number,
    setRaceId: (raceId: number) => any,
    submitButtonDisabled: boolean,
}> = ({
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
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="input-group">
                <label>
                    Dossard
                    <input className="input"
                           type="number"
                           min={1}
                           max={999999}
                           required={true}
                           value={id}
                           name="id"
                           onKeyPress={e => {
                               if (!/[0-9]/.test(e.key)) {
                                   e.preventDefault();
                               }
                           }}
                           onChange={e => {
                               if (e.target.value === "") {
                                   setId(1);
                                   return;
                               }
                               const id = parseInt(e.target.value);
                               if (isNaN(id)) return;
                               setId(id)
                           }}
                    />
                </label>
            </div>

            <div className="input-group mt-3">
                <label>
                    Prénom
                    <input className="input"
                           type="text"
                           maxLength={255}
                           required={true}
                           value={firstname}
                           name="firstname"
                           onChange={e => setFirstname(e.target.value)}
                    />
                </label>
            </div>

            <div className="input-group mt-3">
                <label>
                    Nom de famille
                    <input className="input"
                           type="text"
                           maxLength={255}
                           required={true}
                           value={lastname}
                           name="lastname"
                           onChange={e => setLastname(e.target.value)}
                    />
                </label>
            </div>

            <div className="input-group mt-3">
                <label>
                    Année de naissance
                    <input className="input"
                           type="number"
                           min={1900}
                           max={new Date().getFullYear()}
                           required={true}
                           value={birthYear}
                           name="birth-year"
                           onChange={e => setBirthYear(e.target.value)}
                    />
                </label>
            </div>

            <div className="mt-1">
                <span>Catégorie : {getCategoryNameFromBirthYear(parseInt(birthYear))}</span>
            </div>

            <div className="mt-3">
                <legend>Sexe</legend>
                <div className="inline-input-group">
                    <label className="input-radio">
                        <input type="radio"
                               name="gender"
                               value={Gender.M}
                               checked={gender === Gender.M}
                               onChange={() => setGender(Gender.M)}
                        />
                        <span/>
                        Homme
                    </label>
                </div>
                <div className="inline-input-group">
                    <label className="input-radio">
                        <input type="radio"
                               name="gender"
                               value={Gender.F}
                               checked={gender === Gender.F}
                               onChange={() => setGender(Gender.F)}
                        />
                        <span/>
                        Femme
                    </label>
                </div>
            </div>

            <div className="input-group mt-3">
                <label>
                    Course
                    {races === false &&
                    <select className="input-select">
                        <OptionWithLoadingDots>Chargement des courses</OptionWithLoadingDots>
                    </select>
                    }

                    {races !== false &&
                    <select className="input-select"
                            onChange={e => setRaceId(parseInt(e.target.value))}
                            value={raceId}
                    >
                        {races.map(race => {
                            return (
                                <option key={race.id} value={race.id}>
                                    {race.name} ({race.runnerCount} {race.runnerCount >= 2 ? "coureurs" : "coureur"})
                                </option>
                            );
                        })}
                    </select>
                    }
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

export default RunnerDetailsForm;
