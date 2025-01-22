import React from "react";
import { Col, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import type { AdminRaceWithRunnerCount } from "@live24hisere/core/types";
import { ApiError } from "../../../../errors/ApiError";
import { useAdminEdition } from "../../../../hooks/api/admin/useAdminEdition";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { deleteAdminEdition, patchAdminEdition } from "../../../../services/api/editionService";
import { getAdminEditionRaces } from "../../../../services/api/raceService";
import { getEditionDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import ToastService from "../../../../services/ToastService";
import { isApiRequestResultOk } from "../../../../utils/apiUtils";
import { appContext } from "../../../App";
import CircularLoader from "../../../ui/CircularLoader";
import Page from "../../../ui/Page";
import EditionDetailsForm from "../../../viewParts/admin/editions/EditionDetailsForm";
import EditionRaces from "../../../viewParts/admin/editions/EditionRaces";

export default function EditionDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { accessToken } = React.useContext(appContext).user;

  const { editionId: urlEditionId } = useRequiredParams(["editionId"]);

  const getEditionResult = useAdminEdition(urlEditionId);
  const edition = getEditionResult.data?.edition;
  const isEditionNotFound = getEditionResult.error instanceof ApiError && getEditionResult.error.statusCode === 404;

  const [races, setRaces] = React.useState<AdminRaceWithRunnerCount[] | null | undefined>(undefined);

  const [editionName, setEditionName] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(false);

  const [isSaving, setIsSaving] = React.useState(false);

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

  const fetchRaces = React.useCallback(async () => {
    if (!edition || !accessToken) {
      return;
    }

    const result = await getAdminEditionRaces(accessToken, edition.id);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Impossible de récupérer les courses de l'édition");
      setRaces(null);
      return;
    }

    const responseJson = result.json;

    setRaces(responseJson.races);
  }, [accessToken, edition]);

  React.useEffect(() => {
    void fetchRaces();
  }, [fetchRaces]);

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!edition || !accessToken) {
      return;
    }

    setIsSaving(true);

    const body = {
      name: editionName,
      isPublic,
    };

    const result = await patchAdminEdition(accessToken, edition.id, body);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Une erreur est survenue");
      setIsSaving(false);
      return;
    }

    ToastService.getToastr().success("Paramètres de l'édition enregistrés");

    await getEditionResult.refetch();
    setIsSaving(false);
  };

  const deleteEdition = React.useCallback(async () => {
    if (!edition || !accessToken) {
      return;
    }

    if (edition.raceCount > 0) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette édition ?")) {
      return;
    }

    const result = await deleteAdminEdition(accessToken, edition.id);

    if (!isApiRequestResultOk(result)) {
      ToastService.getToastr().error("Une erreur est survenue");
      return;
    }

    ToastService.getToastr().success("Edition supprimée");
    void navigate("/admin/editions");
  }, [accessToken, edition, navigate]);

  console.log("ERROR", getEditionResult.error);

  if (isEditionNotFound) {
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
                    submitButtonDisabled={isSaving || !unsavedChanges}
                  />
                </Col>
              </Row>

              <EditionRaces editionId={edition.id} races={races} setRaces={setRaces} />

              <Row>
                <Col>
                  <h3>Supprimer l'édition</h3>

                  {edition.raceCount > 0 ? (
                    <p>L'édition ne peut pas être supprimée tant qu'elle contient des courses.</p>
                  ) : (
                    <p>Cette action est irréversible.</p>
                  )}

                  <button
                    className="button red mt-3"
                    disabled={edition.raceCount > 0}
                    onClick={() => {
                      void deleteEdition();
                    }}
                  >
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
