import type React from "react";
import { EDITION_NAME_MAX_LENGTH } from "@live24hisere/core/constants";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";

interface EditionDetailsFormProps {
  onSubmit: (e: React.FormEvent) => void;
  name: string;
  setName: (name: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  submitButtonDisabled: boolean;
}

export default function EditionDetailsForm({
  onSubmit,
  name,
  setName,
  isPublic,
  setIsPublic,
  submitButtonDisabled,
}: EditionDetailsFormProps): React.ReactElement {
  return (
    <form onSubmit={onSubmit}>
      <Input
        label="Nom"
        maxLength={EDITION_NAME_MAX_LENGTH}
        required
        name="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      <Checkbox
        label="Visible publiquement"
        checked={isPublic}
        className="mt-3"
        onChange={(e) => {
          setIsPublic(e.target.checked);
        }}
      />

      <button className="button mt-3" type="submit" disabled={submitButtonDisabled}>
        Enregistrer
      </button>
    </form>
  );
}
