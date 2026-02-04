import React from "react";
import { useNavigate } from "react-router-dom";
import { usePostAdminPassageImportRule } from "../../../../hooks/api/requests/admin/passageImportRules/usePostAdminPassageImportRule";
import { getCreatePassageImportRuleBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Card } from "../../../ui/Card";
import Page from "../../../ui/Page";
import PassageImportRuleDetailsForm from "../../../viewParts/admin/passageImportRules/PassageImportRuleDetailsForm";

export default function CreatePassageImportRuleAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const postRuleMutation = usePostAdminPassageImportRule();

  const [url, setUrl] = React.useState("");
  const [isActive, setIsActive] = React.useState(false);

  const onSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    const body = { url, isActive };

    postRuleMutation.mutate(body, {
      onSuccess: ({ rule }) => {
        void navigate(`/admin/passage-import-rules/${rule.id}`);
      },
    });
  };

  return (
    <Page
      id="admin-create-passage-import-rule"
      htmlTitle="Créer une règle d'import de passages"
      title="Créer une règle d'import de passages"
      breadCrumbs={getCreatePassageImportRuleBreadcrumbs()}
    >
      <Card className="flex flex-col gap-3">
        <div className="w-full md:w-1/2 xl:w-1/4">
          <PassageImportRuleDetailsForm
            onSubmit={onSubmit}
            url={url}
            setUrl={setUrl}
            isActive={isActive}
            setIsActive={setIsActive}
            submitButtonDisabled={postRuleMutation.isPending}
          />
        </div>
      </Card>
    </Page>
  );
}
