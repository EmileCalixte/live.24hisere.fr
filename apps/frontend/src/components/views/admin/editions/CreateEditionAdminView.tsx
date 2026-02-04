import React from "react";
import { useNavigate } from "react-router-dom";
import { usePostAdminEdition } from "../../../../hooks/api/requests/admin/editions/usePostAdminEdition";
import { getEditionCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import type { FormSubmitEventHandler } from "../../../../types/utils/react";
import { Card } from "../../../ui/Card";
import Page from "../../../ui/Page";
import EditionDetailsForm from "../../../viewParts/admin/editions/EditionDetailsForm";

export default function CreateEditionAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const postEditionMutation = usePostAdminEdition();

  const [editionName, setEditionName] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(false);

  const onSubmit: FormSubmitEventHandler = (e) => {
    e.preventDefault();

    const body = {
      name: editionName,
      isPublic,
    };

    postEditionMutation.mutate(body, {
      onSuccess: ({ edition }) => {
        void navigate(`/admin/editions/${edition.id}`);
      },
    });
  };

  return (
    <Page
      id="admin-create-edition"
      htmlTitle="Créer une édition"
      title="Créer une édition"
      breadCrumbs={getEditionCreateBreadcrumbs()}
    >
      <Card>
        <div className="w-full md:w-1/2 xl:w-1/4">
          <EditionDetailsForm
            onSubmit={onSubmit}
            name={editionName}
            setName={setEditionName}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            submitButtonDisabled={postEditionMutation.isPending}
          />
        </div>
      </Card>
    </Page>
  );
}
