import React from "react";
import { type Gender } from "@live24hisere/core/types";
import { categoryUtils } from "@live24hisere/utils";
import { GENDER_OPTIONS } from "../../../../constants/forms";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";
import RadioGroup from "../../../ui/forms/RadioGroup";

interface RunnerDetailsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  firstname: string;
  setFirstname: (firstname: string) => void;
  lastname: string;
  setLastname: (lastname: string) => void;
  gender: Gender;
  setGender: (gender: Gender) => void;
  birthYear: string;
  setBirthYear: (birthYear: string) => void;
  isPublic: boolean;
  setIsPublic: (stopped: boolean) => void;
  submitButtonDisabled: boolean;
}

export default function RunnerDetailsForm({
  onSubmit,
  firstname,
  setFirstname,
  lastname,
  setLastname,
  gender,
  setGender,
  birthYear,
  setBirthYear,
  isPublic,
  setIsPublic,
  submitButtonDisabled,
}: RunnerDetailsFormProps): React.ReactElement {
  // const racesOptions = useMemo(() => {
  //   return getRacesSelectOptions(
  //     races,
  //     (race) => `${race.name} (${race.runnerCount} ${race.runnerCount >= 2 ? "coureurs" : "coureur"})`,
  //   );
  // }, [races]);

  return (
    <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
      <Input
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
        label="Nom de famille"
        name="lastname"
        maxLength={255}
        required
        value={lastname}
        onChange={(e) => {
          setLastname(e.target.value);
        }}
      />

      <div className="d-flex flex-column gap-1">
        <Input
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

        <div>
          <span>Catégorie : {categoryUtils.getCategoryNameFromBirthYear(parseInt(birthYear))}</span>
        </div>
      </div>

      <RadioGroup
        legend="Sexe"
        options={GENDER_OPTIONS}
        value={gender}
        onSelectOption={(option) => {
          setGender(option.value);
        }}
      />

      <Checkbox
        label="Visible publiquement"
        checked={isPublic}
        onChange={(e) => {
          setIsPublic(e.target.checked);
        }}
      />

      {/* {races && races.length < 1 ? (
        <p>
          Vous devez <Link to="/admin/races/create">créer une course</Link> pour pouvoir enregistrer un coureur.
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
      )} */}

      <div>
        <button className="button" type="submit" disabled={submitButtonDisabled}>
          Enregistrer
        </button>
      </div>
    </form>
  );
}
