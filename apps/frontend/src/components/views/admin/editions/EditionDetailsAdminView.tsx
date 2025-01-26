import React from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { useDeleteAdminEdition } from "../../../../hooks/api/requests/admin/editions/useDeleteAdminEdition";
import { useGetAdminEdition } from "../../../../hooks/api/requests/admin/editions/useGetAdminEdition";
import { usePatchAdminEdition } from "../../../../hooks/api/requests/admin/editions/usePatchAdminEdition";
import { useGetAdminEditionRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminEditionRaces";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getEditionDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { is404Error } from "../../../../utils/apiUtils";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import EditionDetailsForm from "../../../viewParts/admin/editions/EditionDetailsForm";
import EditionRaces from "../../../viewParts/admin/editions/EditionRaces";

export default function EditionDetailsAdminView(): React.ReactElement {
  const { editionId: urlEditionId } = useRequiredParams(["editionId"]);

  const getEditionQuery = useGetAdminEdition(urlEditionId);
  const edition = getEditionQuery.data?.edition;
  const isEditionNotFound = is404Error(getEditionQuery.error);

  const patchEditionMutation = usePatchAdminEdition(edition?.id, getEditionQuery.refetch);
  const deleteEditionMutation = useDeleteAdminEdition(edition?.id);

  const getRacesQuery = useGetAdminEditionRaces(edition?.id);
  const races = getRacesQuery.data?.races;

  const [editionName, setEditionName] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(false);

  const unsavedChanges = React.useMemo(() => {
    if (!edition) {
      return false;
    }

    return [editionName === edition.name, isPublic === edition.isPublic].includes(false);
  }, [edition, editionName, isPublic]);

  React.useEffect(() => {
    if (!edition) {
      return;
    }

    setEditionName(edition.name);
    setIsPublic(edition.isPublic);
  }, [edition]);

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();

    const body = {
      name: editionName,
      isPublic,
    };

    patchEditionMutation.mutate(body);
  };

  const deleteEdition = (): void => {
    if (!edition || edition.raceCount > 0) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette édition ?")) {
      return;
    }

    deleteEditionMutation.mutate();
  };

  if (isEditionNotFound || deleteEditionMutation.isSuccess) {
    return <Navigate to="/admin/editions" />;
  }

  return (
    <Page
      id="admin-edition-details"
      title={edition === undefined ? "Chargement" : `Détails de l'édition ${edition.name}`}
    >
      <Row>
        <Col>{getEditionDetailsBreadcrumbs(edition)}</Col>
      </Row>

      <Row>
        <Col xxl={3} xl={4} lg={6} md={9} sm={12}>
          {edition === undefined && <CircularLoader />}

          {edition !== undefined && (
            <>
              <Row>
                <Col>
                  <EditionDetailsForm
                    onSubmit={onSubmit}
                    name={editionName}
                    setName={setEditionName}
                    isPublic={isPublic}
                    setIsPublic={setIsPublic}
                    submitButtonDisabled={
                      patchEditionMutation.isPending || getEditionQuery.isPending || !unsavedChanges
                    }
                  />
                </Col>
              </Row>

              <EditionRaces editionId={edition.id} races={races} getRacesQuery={getRacesQuery} />

              <Row>
                <Col>
                  <h3>Supprimer l'édition</h3>

                  {edition.raceCount > 0 ? (
                    <p>L'édition ne peut pas être supprimée tant qu'elle contient des courses.</p>
                  ) : (
                    <p>Cette action est irréversible.</p>
                  )}

                  <button className="button red mt-3" disabled={edition.raceCount > 0} onClick={deleteEdition}>
                    Supprimer l'édition
                  </button>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Page>
  );
}
