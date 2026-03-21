import React from "react";
import type { Gender } from "@live24hisere/core/types";
import { COUNTRY_NULL_OPTION_VALUE, COUNTRY_OPTIONS_WITH_NULL, GENDER_OPTIONS } from "../../../../constants/forms";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { sortCountryOptions } from "../../../../utils/countryUtils";
import { getDuvRunnerUrl } from "../../../../utils/duvUtils";
import { Button } from "../../../ui/forms/Button";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";
import RadioGroup from "../../../ui/forms/RadioGroup";
import Select from "../../../ui/forms/Select";
import { Link } from "../../../ui/Link";

interface RunnerDetailsFormProps {
  onSubmit: FormSubmitEventHandler;
  firstname: string;
  setFirstname: (firstname: string) => void;
  lastname: string;
  setLastname: (lastname: string) => void;
  gender: Gender;
  setGender: (gender: Gender) => void;
  birthYear: string;
  setBirthYear: (birthYear: string) => void;
  countryCode: string | null;
  setCountryCode: (countryCode: string) => void;
  duvRunnerId: string;
  setDuvRunnerId: (duvRunnerId: string) => void;
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
  countryCode,
  setCountryCode,
  duvRunnerId,
  setDuvRunnerId,
  isPublic,
  setIsPublic,
  submitButtonDisabled,
}: RunnerDetailsFormProps): React.ReactElement {
  const countryOptions = React.useMemo(() => sortCountryOptions(COUNTRY_OPTIONS_WITH_NULL), []);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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

      <Select
        label="Pays"
        options={countryOptions}
        value={countryCode ?? COUNTRY_NULL_OPTION_VALUE}
        onChange={(e) => {
          setCountryCode(e.target.value);
        }}
      />

      <RadioGroup
        legend="Sexe"
        name="gender"
        options={GENDER_OPTIONS}
        value={gender}
        onSelectOption={(option) => {
          setGender(option.value);
        }}
      />

      <div className="flex flex-col gap-1">
        <Input
          label="Identifiant DUV"
          name="duvRunnerId"
          maxLength={36}
          required
          value={duvRunnerId}
          onChange={(e) => {
            setDuvRunnerId(e.target.value);
          }}
        />
        {duvRunnerId.trim().length > 0 && (
          <p>
            <Link to={getDuvRunnerUrl(duvRunnerId)} target="_blank">
              Voir sur DUV
            </Link>
          </p>
        )}
      </div>

      <Checkbox
        label="Visible publiquement"
        checked={isPublic}
        onChange={(e) => {
          setIsPublic(e.target.checked);
        }}
      />

      <div>
        <Button type="submit" disabled={submitButtonDisabled}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
