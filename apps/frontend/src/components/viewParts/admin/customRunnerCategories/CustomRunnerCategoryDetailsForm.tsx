import {
  CUSTOM_RUNNER_CATEGORY_CODE_MAX_LENGTH,
  CUSTOM_RUNNER_CATEGORY_NAME_MAX_LENGTH,
} from "@live24hisere/core/constants";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Button } from "../../../ui/forms/Button";
import { Input } from "../../../ui/forms/Input";

interface CustomRunnerCategoryDetailsFormProps {
  onSubmit: FormSubmitEventHandler;
  code: string;
  setCode: (code: string) => void;
  codeAlreadyExists: boolean;
  name: string;
  setName: (name: string) => void;
  submitButtonDisabled: boolean;
}

export default function CustomRunnerCategoryDetailsForm({
  onSubmit,
  code,
  setCode,
  codeAlreadyExists,
  name,
  setName,
  submitButtonDisabled,
}: CustomRunnerCategoryDetailsFormProps): React.ReactElement {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input
        label="Code"
        maxLength={CUSTOM_RUNNER_CATEGORY_CODE_MAX_LENGTH}
        required
        name="code"
        value={code}
        hasError={codeAlreadyExists}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase());
        }}
      />

      <Input
        label="Nom"
        maxLength={CUSTOM_RUNNER_CATEGORY_NAME_MAX_LENGTH}
        required
        name="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
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
