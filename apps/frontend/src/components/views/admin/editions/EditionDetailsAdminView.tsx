import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDeleteAdminEdition } from "../../../../hooks/api/requests/admin/editions/useDeleteAdminEdition";
import { useGetAdminEdition } from "../../../../hooks/api/requests/admin/editions/useGetAdminEdition";
import { usePatchAdminEdition } from "../../../../hooks/api/requests/admin/editions/usePatchAdminEdition";
import { useGetAdminEditionRaces } from "../../../../hooks/api/requests/admin/races/useGetAdminEditionRaces";
import { useRequiredParams } from "../../../../hooks/useRequiredParams";
import { getEditionDetailsBreadcrumbs } from "../../../../services/breadcrumbs/breadcrumbService";
import { is404Error } from "../../../../utils/apiUtils";
import { Card } from "../../../ui/Card";
import CircularLoader from "../../../ui/CircularLoader";
import { Button } from "../../../ui/forms/Button";
import Page from "../../../ui/Page";
import { Separator } from "../../../ui/Separator";
import EditionDetailsForm from "../../../viewParts/admin/editions/EditionDetailsForm";
import EditionRaces from "../../../viewParts/admin/editions/EditionRaces";

export default function EditionDetailsAdminView(): React.ReactElement {
  const navigate = useNavigate();

  const { editionId: urlEditionId } = useRequiredParams(["editionId"]);

  const getEditionQuery = useGetAdminEdition(urlEditionId);
  const edition = getEditionQuery.data?.edition;
  const isEditionNotFound = is404Error(getEditionQuery.error);

  const patchEditionMutation = usePatchAdminEdition(edition?.id);
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

    patchEditionMutation.mutate(body, {
      onSuccess: () => {
        void getEditionQuery.refetch();
      },
    });
  };

  function deleteEdition(): void {
    if (!edition || edition.raceCount > 0) {
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette édition ?")) {
      return;
    }

    deleteEditionMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate("/admin/editions");
      },
    });
  }

  if (isEditionNotFound) {
    return <Navigate to="/admin/editions" />;
  }

  return (
    <Page
      id="admin-edition-details"
      htmlTitle={edition === undefined ? "Chargement" : `Détails de l'édition ${edition.name}`}
      title={edition === undefined ? undefined : `Détails de l'édition ${edition.name}`}
      breadCrumbs={getEditionDetailsBreadcrumbs(edition)}
    >
      {edition === undefined ? (
        <CircularLoader />
      ) : (
        <Card className="flex flex-col gap-3">
          <h2>Informations</h2>

          <div className="w-full md:w-[50%] xl:w-[25%]">
            <EditionDetailsForm
              onSubmit={onSubmit}
              name={editionName}
              setName={setEditionName}
              isPublic={isPublic}
              setIsPublic={setIsPublic}
              submitButtonDisabled={patchEditionMutation.isPending || getEditionQuery.isPending || !unsavedChanges}
            />
          </div>

          <Separator className="my-5" />

          <EditionRaces editionId={edition.id} races={races} getRacesQuery={getRacesQuery} />

          <Separator className="my-5" />

          <h3>Supprimer l'édition</h3>

          {edition.raceCount > 0 ? (
            <p>L'édition ne peut pas être supprimée tant qu'elle contient des courses.</p>
          ) : (
            <p>Cette action est irréversible.</p>
          )}

          <div>
            <Button color="red" disabled={edition.raceCount > 0} onClick={deleteEdition}>
              Supprimer l'édition
            </Button>
          </div>
        </Card>
      )}
    </Page>
  );
}
