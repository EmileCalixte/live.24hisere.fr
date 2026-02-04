import type React from "react";
import { EDITION_NAME_MAX_LENGTH } from "@live24hisere/core/constants";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Button } from "../../../ui/forms/Button";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";

interface EditionDetailsFormProps {
  onSubmit: FormSubmitEventHandler;
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
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
