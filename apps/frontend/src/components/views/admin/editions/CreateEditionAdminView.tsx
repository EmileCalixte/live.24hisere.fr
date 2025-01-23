import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { usePostAdminEdition } from "../../../../hooks/api/requests/admin/editions/usePostAdminEdition";
import { getEditionCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import Page from "../../../ui/Page";
import EditionDetailsForm from "../../../viewParts/admin/editions/EditionDetailsForm";

export default function CreateEditionAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const postEditionMutation = usePostAdminEdition();

  const [editionName, setEditionName] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(false);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      name: editionName,
      isPublic,
    };

    postEditionMutation.mutate(body);
  };

  React.useEffect(() => {
    if (postEditionMutation.isSuccess) {
      void navigate(`/admin/editions/${postEditionMutation.data.edition.id}`);
    }
  }, [navigate, postEditionMutation.data?.edition.id, postEditionMutation.isSuccess]);

  return (
    <Page id="admin-create-edition" title="Créer une édition">
      <Row>
        <Col>{getEditionCreateBreadcrumbs()}</Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          <h2>Créer une édition</h2>

          <EditionDetailsForm
            onSubmit={onSubmit}
            name={editionName}
            setName={setEditionName}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            submitButtonDisabled={postEditionMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
}
