import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postAdminEdition } from "../../../../services/api/editionService";
import { getEditionCreateBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import Page from "../../../ui/Page";
import EditionDetailsForm from "../../../viewParts/admin/editions/EditionDetailsForm";

export default function CreateEditionAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const [editionName, setEditionName] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

  const onSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!accessToken) {
        return;
      }

      setIsSaving(true);

      const body = {
        name: editionName,
        isPublic,
      };

      const result = await postAdminEdition(accessToken, body);

      if (!isApiRequestResultOk(result)) {
        ToastService.getToastr().error("Une erreur est survenue");
        setIsSaving(false);
        return;
      }

      ToastService.getToastr().success("Édition créée");
      navigate(`/admin/editions/${result.json.edition.id}`);
    },
    [accessToken, editionName, isPublic, navigate],
  );

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
            submitButtonDisabled={isSaving}
          />
        </Col>
      </Row>
    </Page>
  );
}
