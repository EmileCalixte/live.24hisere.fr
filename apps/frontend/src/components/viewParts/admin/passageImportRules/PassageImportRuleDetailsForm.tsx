import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Button } from "../../../ui/forms/Button";
import { Checkbox } from "../../../ui/forms/Checkbox";
import { Input } from "../../../ui/forms/Input";

interface PassageImportRuleDetailsFormProps {
  onSubmit: FormSubmitEventHandler;
  url: string;
  setUrl: (url: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  submitButtonDisabled: boolean;
}

export default function PassageImportRuleDetailsForm({
  onSubmit,
  url,
  setUrl,
  isActive,
  setIsActive,
  submitButtonDisabled,
}: PassageImportRuleDetailsFormProps): React.ReactElement {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Input
        label="URL du fichier DAG"
        required
        name="url"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
      />

      <Checkbox
        label="Active"
        checked={isActive}
        onChange={(e) => {
          setIsActive(e.target.checked);
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
